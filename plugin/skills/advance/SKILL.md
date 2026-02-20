---
description: (Internal) Advance to the next hat in the AI-DLC workflow
user-invocable: false
---

## Name

`ai-dlc:advance` - Move to the next hat in the AI-DLC workflow sequence.

## Synopsis

```
/advance
```

## Description

**Internal command** - Called by the AI during `/construct`, not directly by users.

Advances to the next hat in the workflow sequence. For example, in the default workflow:
- planner -> builder (plan ready, now implement)
- builder -> reviewer (bolt complete, now review)

**When at the last hat (reviewer)**, `/advance` handles completion automatically:
- If all units complete -> Mark intent as complete
- If more units ready -> Loop back to builder for next unit
- If blocked (no ready units) -> Alert user, human intervention required

## Implementation

### Step 1: Load Current State

```bash
# Intent-level state is stored on current branch (intent branch)
STATE=$(han keep load iteration.json --quiet)
```

### Step 2: Determine Next Hat (or Handle Completion)

```javascript
const workflow = state.workflow || ["planner", "builder", "reviewer"];
const currentIndex = workflow.indexOf(state.hat);
const nextIndex = currentIndex + 1;

if (nextIndex >= workflow.length) {
  // At last hat - check DAG status to determine next action
  // See Steps 2b-2d below
}

const nextHat = workflow[nextIndex];
```

### Step 2b: Last Hat Logic (Completion/Loop/Block)

When at the last hat (typically reviewer), check the DAG to determine next action:

```bash
# Source the DAG library
source "${CLAUDE_PLUGIN_ROOT}/lib/dag.sh"

# Get intent directory
INTENT_SLUG=$(han keep load intent-slug --quiet)
INTENT_DIR=".ai-dlc/${INTENT_SLUG}"

# Mark current unit as completed
CURRENT_UNIT=$(echo "$ITERATION_JSON" | han parse json currentUnit -r --default "")
if [ -n "$CURRENT_UNIT" ] && [ -f "$INTENT_DIR/${CURRENT_UNIT}.md" ]; then
  update_unit_status "$INTENT_DIR/${CURRENT_UNIT}.md" "completed"
fi
```

### Step 2c: Merge Unit Branch on Completion

After marking a unit as completed, merge the unit branch into the intent branch:

```bash
# Load config for merge settings
source "${CLAUDE_PLUGIN_ROOT}/lib/config.sh"
INTENT_DIR=".ai-dlc/${INTENT_SLUG}"
CONFIG=$(get_ai_dlc_config "$INTENT_DIR")
AUTO_MERGE=$(echo "$CONFIG" | jq -r '.auto_merge // "true"')
AUTO_SQUASH=$(echo "$CONFIG" | jq -r '.auto_squash // "false"')

if [ "$AUTO_MERGE" = "true" ]; then
  UNIT_SLUG="${CURRENT_UNIT#unit-}"
  UNIT_BRANCH="ai-dlc/${INTENT_SLUG}/${UNIT_SLUG}"

  # Ensure we're on the intent branch
  git checkout "ai-dlc/${INTENT_SLUG}/main"

  # Merge unit branch
  if [ "$AUTO_SQUASH" = "true" ]; then
    git merge --squash "$UNIT_BRANCH"
    git commit -m "unit: ${CURRENT_UNIT} completed"
  else
    git merge --no-ff "$UNIT_BRANCH" -m "Merge ${CURRENT_UNIT} into intent branch"
  fi

  # Clean up unit worktree
  WORKTREE_PATH="/tmp/ai-dlc-${INTENT_SLUG}-${UNIT_SLUG}"
  [ -d "$WORKTREE_PATH" ] && git worktree remove "$WORKTREE_PATH"
fi
```

```bash
# Get DAG summary
DAG_SUMMARY=$(get_dag_summary "$INTENT_DIR")
ALL_COMPLETE=$(echo "$DAG_SUMMARY" | han parse json allComplete -r)
READY_COUNT=$(echo "$DAG_SUMMARY" | han parse json readyCount -r)
```

```javascript
if (dagSummary.allComplete) {
  // ALL UNITS COMPLETE - Check if integrator should run
  // Skip integrator for single-unit intents (reviewer already validated it)
  const unitCount = dagSummary.totalCount;
  if (unitCount > 1 && !state.integratorComplete) {
    // Spawn integrator on the intent branch
    // See Step 2e below
    return spawnIntegrator();
  }
  // Integrator passed - Mark intent as done
  state.status = "complete";
  // han keep save iteration.json '<updated JSON>'
  // Output completion summary (see Step 5)
  return completionSummary;
}

if (dagSummary.readyCount > 0) {
  // MORE UNITS READY - Loop back to builder
  state.hat = workflow[2] || "builder";  // Reset to builder (index 2 in default workflow)
  state.currentUnit = null;  // Will be set by /construct when it picks next unit
  // han keep save iteration.json '<updated JSON>'
  return `Unit completed. ${dagSummary.readyCount} more unit(s) ready. Continuing construction...`;
}

// BLOCKED - No ready units, human must intervene
return `All remaining units are blocked. Human intervention required.

Blocked units:
${dagSummary.blockedUnits.join('\n')}

Review blockers and unblock units to continue.`;
```

### Step 2d: Spawn Newly Unblocked Units (Agent Teams)

When `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is enabled and completing a unit unblocks new units:

```bash
AGENT_TEAMS_ENABLED="${CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS:-}"
```

If `AGENT_TEAMS_ENABLED` is set and `readyCount > 0` after completing a unit:

1. Read `teamName` from `iteration.json`
2. For each newly ready unit:
   - Initialize `unitStates.{unit}.hat = "planner"` and `unitStates.{unit}.retries = 0`
   - Create unit worktree
   - Mark unit as `in_progress`
   - Spawn planner teammate via Task with `team_name` and `name`
3. Save updated state to `iteration.json`

This replaces the sequential "loop back to builder" behavior when Agent Teams is active. Instead of the lead picking up the next unit sequentially, newly unblocked units are spawned as parallel teammates immediately.

**Without Agent Teams:** The existing behavior (reset hat to builder, let `/construct` pick next unit) continues unchanged.

### Step 2e: Integrator Spawning (When All Units Complete)

When `dagSummary.allComplete` is true and `state.integratorComplete` is not true, spawn the Integrator instead of marking the intent complete.

**The Integrator is NOT a per-unit hat** — it does not appear in the workflow sequence. It runs once on the merged intent branch after all units pass their per-unit workflows.

1. Set state to indicate integrator is running:

```bash
STATE=$(echo "$STATE" | han parse json --set "hat=integrator")
han keep save iteration.json "$STATE"
```

2. Load integrator hat instructions:

```bash
HAT_FILE=""
if [ -f ".ai-dlc/hats/integrator.md" ]; then
  HAT_FILE=".ai-dlc/hats/integrator.md"
elif [ -n "$CLAUDE_PLUGIN_ROOT" ] && [ -f "${CLAUDE_PLUGIN_ROOT}/hats/integrator.md" ]; then
  HAT_FILE="${CLAUDE_PLUGIN_ROOT}/hats/integrator.md"
fi

HAT_INSTRUCTIONS=""
if [ -n "$HAT_FILE" ]; then
  HAT_INSTRUCTIONS=$(sed '1,/^---$/d' "$HAT_FILE" | sed '1,/^---$/d')
fi
```

3. Spawn integrator subagent on the **intent worktree** (not a unit worktree):

```javascript
Task({
  subagent_type: "general-purpose",
  description: `integrator: ${intentSlug}`,
  prompt: `
    Execute the Integrator role for intent ${intentSlug}.

    ## Your Role: Integrator
    ${HAT_INSTRUCTIONS}

    ## CRITICAL: Work on Intent Branch
    **Worktree path:** /tmp/ai-dlc-${intentSlug}/
    **Branch:** ai-dlc/${intentSlug}/main

    You MUST:
    1. cd /tmp/ai-dlc-${intentSlug}/
    2. Verify you're on the intent branch (not a unit branch)
    3. This branch contains ALL merged unit work

    ## Intent-Level Success Criteria
    ${intentCriteria}

    ## Completed Units
    ${completedUnitsList}

    Verify that all units work together and intent-level criteria are met.
    Report ACCEPT or REJECT with specific details.
  `
})
```

4. Handle integrator result:

**If ACCEPT:**
```bash
STATE=$(echo "$STATE" | han parse json --set "integratorComplete=true" --set "status=complete")
han keep save iteration.json "$STATE"
# Proceed to Step 5 (completion summary)
```

**If REJECT:**

The integrator specifies which units need rework. For each rejected unit:

```bash
source "${CLAUDE_PLUGIN_ROOT}/lib/dag.sh"
WORKFLOW_HATS=$(echo "$STATE" | han parse json workflow)
FIRST_HAT=$(echo "$WORKFLOW_HATS" | jq -r '.[0]')

# Re-queue each rejected unit
for UNIT_FILE in $REJECTED_UNITS; do
  update_unit_status "$UNIT_FILE" "pending"

  # Reset hat to first workflow hat in unitStates (teams mode)
  UNIT_NAME=$(basename "$UNIT_FILE" .md)
  STATE=$(echo "$STATE" | han parse json --set "unitStates.${UNIT_NAME}.hat=${FIRST_HAT}" --set "unitStates.${UNIT_NAME}.retries=0")
done

# Reset integrator state
STATE=$(echo "$STATE" | han parse json --set "hat=${FIRST_HAT}" --set "integratorComplete=false")
han keep save iteration.json "$STATE"

# Output: "Integrator rejected. Re-queued units: {list}. Run /construct to continue."
```

The re-queued units will be picked up on the next `/construct` cycle through the normal DAG-based unit selection.

### Step 3: Update State

```bash
# Update hat and signal SessionStart to increment iteration
# Intent-level state saved to current branch (intent branch)
# state.hat = nextHat, state.needsAdvance = true
han keep save iteration.json '<updated JSON with hat and needsAdvance>'
```

### Step 4: Confirm (Normal Advancement)

Output:
```
Advanced to **{nextHat}** hat. Continuing construction...
```

### Step 5: Completion Summary (When All Units Done)

When `/advance` completes the intent (all units done), output:

```
## Intent Complete!

**Total iterations:** {iteration count}
**Workflow:** {workflowName} ({workflowHats})

### What Was Built
{Summary from intent}

### Units Completed
{List of completed units}

### Criteria Satisfied
{List of completion criteria}

### Merge to Default Branch

The intent branch is ready to merge:

```bash
# Load merge config
source "${CLAUDE_PLUGIN_ROOT}/lib/config.sh"
INTENT_DIR=".ai-dlc/${INTENT_SLUG}"
CONFIG=$(get_ai_dlc_config "$INTENT_DIR")
DEFAULT_BRANCH=$(echo "$CONFIG" | jq -r '.default_branch')
```

```
Intent branch ready: ai-dlc/{intent-slug}/main → ${DEFAULT_BRANCH}

Create PR: gh pr create --base ${DEFAULT_BRANCH} --head ai-dlc/{intent-slug}/main
```

Then ask the user how to deliver using `AskUserQuestion`:

```json
{
  "questions": [{
    "question": "How would you like to deliver this intent?",
    "header": "Delivery",
    "options": [
      {"label": "Open PR/MR for delivery", "description": "Create a pull/merge request to merge into the default branch"},
      {"label": "I'll handle it", "description": "Just show me the branch details"}
    ],
    "multiSelect": false
  }]
}
```

### If PR/MR:

1. Push intent branch to remote (if not already):

```bash
INTENT_BRANCH="ai-dlc/${INTENT_SLUG}/main"
git push -u origin "$INTENT_BRANCH" 2>/dev/null || true
```

2. Create PR/MR:

```bash
gh pr create \
  --title "${INTENT_TITLE}" \
  --base "$DEFAULT_BRANCH" \
  --head "$INTENT_BRANCH" \
  --body "$(cat <<EOF
## Summary
${PROBLEM_SECTION}

${SOLUTION_SECTION}

## Test Plan
${SUCCESS_CRITERIA_AS_CHECKLIST}

## Changes
${COMPLETED_UNITS_AS_CHANGE_LIST}

---
*Built with [AI-DLC](https://ai-dlc.dev)*
EOF
)"
```

3. Output the PR URL.

### If manual:

```
Intent branch ready: ai-dlc/{intent-slug}/main → ${DEFAULT_BRANCH}

To merge:
  git checkout ${DEFAULT_BRANCH}
  git merge --no-ff ai-dlc/{intent-slug}/main

To create PR manually:
  gh pr create --base ${DEFAULT_BRANCH} --head ai-dlc/{intent-slug}/main

To clean up:
  git worktree remove /tmp/ai-dlc-{intent-slug}
  /reset
```
