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
- elaborator -> planner (intent defined, now plan the work)
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
const workflow = state.workflow || ["elaborator", "planner", "builder", "reviewer"];
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
  git checkout "ai-dlc/${INTENT_SLUG}"

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
  // ALL UNITS COMPLETE - Mark intent as done
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
Intent branch ready: ai-dlc/{intent-slug} → ${DEFAULT_BRANCH}

Create PR: gh pr create --base ${DEFAULT_BRANCH} --head ai-dlc/{intent-slug}
```

### Next Steps

1. **Review changes** - Check the work on branch `ai-dlc/{intent-slug}`
2. **Create PR** - `gh pr create --base ${DEFAULT_BRANCH} --head ai-dlc/{intent-slug}`
3. **Clean up worktrees** - `git worktree remove /tmp/ai-dlc-{intent-slug}`
4. **Start new task** - Run `/reset` to clear state, then `/elaborate`
```
