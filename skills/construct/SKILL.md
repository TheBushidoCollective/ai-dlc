---
description: Continue the AI-DLC construction loop - autonomous build/review cycles until completion
disable-model-invocation: true
---

## Name

`ai-dlc:construct` - Run the autonomous AI-DLC construction loop.

## Synopsis

```
/construct
```

## Description

**User-facing command** - Continue the AI-DLC autonomous construction loop.

This command resumes work from the current hat and runs until:
- All units complete (`/advance` completes the intent automatically)
- User intervention needed (all units blocked)
- Session exhausted (Stop hook instructs agent to call `/construct`)

**User Flow:**
```
User: /elaborate           # Once - define intent, criteria, and workflow
User: /construct           # Kicks off autonomous loop
...AI works autonomously across all units...
...session exhausts, Stop hook fires...
Agent: /construct          # Agent continues (subagents have clean context)
...repeat until all units complete...
AI: Intent complete! [summary]
```

**Important:**
- Fully autonomous - Agent continues across units without stopping
- Subagents have clean context - No `/clear` needed between iterations
- User intervention - Only required when ALL units are blocked
- State preserved - Progress saved in han keep between sessions

**CRITICAL: No Questions During Construction**

During the construction loop, you MUST NOT:
- Use AskUserQuestion tool
- Ask clarifying questions
- Request user decisions
- Pause for user feedback

This breaks han's hook logic. The construction loop must be fully autonomous.

If you encounter ambiguity:
1. Make a reasonable decision based on available context
2. Document the assumption in your work
3. Let the reviewer hat catch issues on the next pass

If truly blocked (cannot proceed without user input):
1. Document the blocker clearly in `han keep save blockers.md`
2. Stop the loop naturally (don't call /advance)
3. The Stop hook will alert the user that human intervention is required

## Implementation

### Step 0: Ensure Intent Worktree

**CRITICAL: The orchestrator MUST run in the intent worktree, not the main working directory.**

Before loading state, find and switch to the intent worktree:

```bash
# First, check if we have an intent slug saved (try to find it)
# Look for .ai-dlc/*/intent.md files to detect intent
INTENT_SLUG=""
for intent_file in .ai-dlc/*/intent.md; do
  [ -f "$intent_file" ] || continue
  dir=$(dirname "$intent_file")
  slug=$(basename "$dir")
  status=$(han parse yaml status -r --default active < "$intent_file" 2>/dev/null || echo "active")
  [ "$status" = "active" ] && INTENT_SLUG="$slug" && break
done

# If we found an intent, ensure we're in its worktree
if [ -n "$INTENT_SLUG" ]; then
  INTENT_BRANCH="ai-dlc/${INTENT_SLUG}"
  INTENT_WORKTREE="/tmp/ai-dlc-${INTENT_SLUG}"

  # Create worktree if it doesn't exist
  if [ ! -d "$INTENT_WORKTREE" ]; then
    git worktree add -B "$INTENT_BRANCH" "$INTENT_WORKTREE"
  fi

  # Switch to the intent worktree
  cd "$INTENT_WORKTREE"
fi
```

**Important:** The orchestrator runs in `/tmp/ai-dlc-{intent-slug}/`, NOT the original repo directory. This keeps main clean and enables parallel intents.

### Step 1: Load State

```bash
# Intent-level state is stored on the current branch (intent branch)
STATE=$(han keep load iteration.json --quiet)
INTENT_SLUG=$(han keep load intent-slug --quiet)
```

If no state exists:
```
No AI-DLC state found.

If you have existing intent artifacts in .ai-dlc/, run /resume to continue.
Otherwise, run /elaborate to start a new task.
```

If status is "complete":
```
Task already complete! Run /reset to start a new task.
```

### Step 1b: Detect Agent Teams

```bash
AGENT_TEAMS_ENABLED="${CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS:-}"
```

If `AGENT_TEAMS_ENABLED` is set, follow the **Agent Teams** path below.
If not set, skip to the **Fallback: Sequential Subagent Execution** section.

### Step 2 (Teams): Create or Reconnect Team

Check if the team already exists before creating:

```bash
TEAM_NAME="ai-dlc-${INTENT_SLUG}"
TEAM_CONFIG="$HOME/.claude/teams/${TEAM_NAME}/config.json"
```

If team config does NOT exist:

```javascript
TeamCreate({
  team_name: `ai-dlc-${intentSlug}`,
  description: `AI-DLC: ${intentTitle}`
})
```

Save `teamName` to `iteration.json`:

```bash
STATE=$(echo "$STATE" | han parse json --set "teamName=$TEAM_NAME")
han keep save iteration.json "$STATE"
```

### Step 3 (Teams): Spawn ALL Ready Units in Parallel

Loop over ALL ready units from the DAG (not just one):

```bash
source "${CLAUDE_PLUGIN_ROOT}/lib/dag.sh"
READY_UNITS=$(find_ready_units "$INTENT_DIR")
```

For EACH ready unit:

1. **Create unit worktree** (same as current Step 2 logic):

```bash
UNIT_NAME=$(basename "$UNIT_FILE" .md)
UNIT_SLUG="${UNIT_NAME#unit-}"
UNIT_BRANCH="ai-dlc/${INTENT_SLUG}/${UNIT_SLUG}"
WORKTREE_PATH="/tmp/ai-dlc-${INTENT_SLUG}-${UNIT_SLUG}"

if [ ! -d "$WORKTREE_PATH" ]; then
  git worktree add -B "$UNIT_BRANCH" "$WORKTREE_PATH"
fi
```

2. **Mark unit as in_progress**:

```bash
update_unit_status "$UNIT_FILE" "in_progress"
```

3. **Initialize unit state in `unitStates`**:

```bash
STATE=$(echo "$STATE" | han parse json --set "unitStates.${UNIT_NAME}.hat=planner" --set "unitStates.${UNIT_NAME}.retries=0")
han keep save iteration.json "$STATE"
```

4. **Create shared task via TaskCreate**:

```javascript
TaskCreate({
  subject: `Plan: ${unitName}`,
  description: `Execute planner role for unit ${unitName}. Worktree: ${WORKTREE_PATH}`,
  activeForm: `Planning ${unitName}`
})
```

5. **Spawn teammate**:

```javascript
Task({
  subagent_type: "Plan",  // planner hat starts as Plan agent
  description: `planner: ${unitName}`,
  name: `planner-${unitSlug}`,
  team_name: `ai-dlc-${intentSlug}`,
  mode: modeToAgentTeamsMode(intentMode),
  prompt: `
    Execute the planner role for this AI-DLC unit.

    ## CRITICAL: Work in Worktree
    **Worktree path:** ${WORKTREE_PATH}
    **Branch:** ${UNIT_BRANCH}

    You MUST:
    1. cd ${WORKTREE_PATH}
    2. Verify you're on branch ${UNIT_BRANCH}
    3. Do ALL work in that directory
    4. Commit changes to that branch

    ## Unit: ${unitName}
    ## Completion Criteria
    ${unit.criteria}

    Work according to your role. Report completion via SendMessage to the team lead when done.
  `
})
```

Mode mapping:

| Intent Mode | Task `mode` | Behavior |
|-------------|-------------|----------|
| HITL | `plan` | Agent proposes, human approves |
| OHOTL | `acceptEdits` | Agent works, human can intervene |
| AHOTL | `bypassPermissions` | Full autonomy within criteria |

### Step 4 (Teams): Monitor and React Loop

The lead processes auto-delivered teammate messages. Handle each event type:

#### Planner Completes

1. Save the plan: `han keep save current-plan.md "<plan content>"`
2. Update `unitStates.{unit}.hat = "builder"`
3. Spawn builder teammate:

```javascript
Task({
  subagent_type: getAgentForDiscipline(unit.discipline),
  description: `builder: ${unitName}`,
  name: `builder-${unitSlug}`,
  team_name: `ai-dlc-${intentSlug}`,
  mode: modeToAgentTeamsMode(intentMode),
  prompt: `Execute the builder role for unit ${unitName}...`
})
```

#### Builder Completes

1. Update `unitStates.{unit}.hat = "reviewer"`
2. Spawn reviewer teammate:

```javascript
Task({
  subagent_type: "general-purpose",
  description: `reviewer: ${unitName}`,
  name: `reviewer-${unitSlug}`,
  team_name: `ai-dlc-${intentSlug}`,
  mode: modeToAgentTeamsMode(intentMode),
  prompt: `Execute the reviewer role for unit ${unitName}...`
})
```

#### Reviewer APPROVES

1. Mark unit completed: `update_unit_status "$UNIT_FILE" "completed"`
2. Remove unit from `unitStates`
3. Check DAG for newly unblocked units
4. For each newly ready unit, go back to Step 3 logic (spawn at planner hat)

#### Reviewer REJECTS

1. Increment `unitStates.{unit}.retries`
2. Check retry limit (max 3):
   - If `retries >= 3`: Mark unit as blocked, document in `han keep save blockers.md`
   - If `retries < 3`: Update `unitStates.{unit}.hat = "builder"`, spawn new builder teammate with reviewer feedback in prompt
3. Continue monitoring

#### Blocked

1. Document the blocker in `han keep save blockers.md`
2. Check if ALL units are blocked
3. If all blocked, alert user: "All units blocked. Human intervention required."

### Step 5 (Teams): Team Shutdown

When all units complete:

1. Send shutdown requests to all active teammates:

```javascript
// For each active teammate
SendMessage({
  type: "shutdown_request",
  recipient: teammateName,
  content: "All units complete. Shutting down team."
})
```

2. Clean up team:

```javascript
TeamDelete()
```

3. Mark intent complete:

```bash
STATE=$(echo "$STATE" | han parse json --set "status=complete")
han keep save iteration.json "$STATE"
```

4. Output completion summary (same as current Step 5 format from `/advance`)

### Per-Unit Hat Tracking

The `iteration.json` is extended with `unitStates` for parallel hat tracking:

```json
{
  "iteration": 3,
  "hat": "builder",
  "status": "active",
  "workflowName": "default",
  "workflow": ["elaborator", "planner", "builder", "reviewer"],
  "teamName": "ai-dlc-my-intent",
  "unitStates": {
    "unit-01-foundation": { "hat": "reviewer", "retries": 0 },
    "unit-02-dag-view": { "hat": "builder", "retries": 1 }
  }
}
```

- `hat`: Current hat for this specific unit
- `retries`: Number of reviewer rejection cycles (max 3 before escalating to blocked)
- Units are added when spawned, removed when completed

---

### Fallback: Sequential Subagent Execution

**Used when `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is NOT set.**

The following steps execute units one-at-a-time using standard Task subagents.

#### Step 2: Create Unit Worktree

**CRITICAL: All work MUST happen in an isolated worktree.**

This prevents conflicts with the parent session and enables true isolation.

```bash
# Determine current unit from state or find next ready unit
UNIT_FILE=$(find_ready_unit "$INTENT_DIR")
UNIT_NAME=$(basename "$UNIT_FILE" .md)  # e.g., unit-01-core-backend
UNIT_SLUG="${UNIT_NAME#unit-}"  # e.g., 01-core-backend
UNIT_BRANCH="ai-dlc/${intentSlug}/${UNIT_SLUG}"
WORKTREE_PATH="/tmp/ai-dlc-${intentSlug}-${UNIT_SLUG}"

# Create worktree if it doesn't exist
if [ ! -d "$WORKTREE_PATH" ]; then
  git worktree add -B "$UNIT_BRANCH" "$WORKTREE_PATH"
fi
```

#### Step 2b: Update Unit Status and Track Current Unit

**CRITICAL: Mark the unit as `in_progress` BEFORE spawning the subagent.**

This ensures the DAG accurately reflects that work has started on this unit.

```bash
# Source the DAG library (CLAUDE_PLUGIN_ROOT is the jutsu-ai-dlc plugin directory)
source "${CLAUDE_PLUGIN_ROOT}/lib/dag.sh"

# Update unit status to in_progress in the intent worktree
# UNIT_FILE points to the file in .ai-dlc/{intent-slug}/
update_unit_status "$UNIT_FILE" "in_progress"
```

**Track current unit in iteration state** so `/advance` knows which unit to mark completed:

```bash
# Update currentUnit in state, e.g., "unit-01-core-backend"
# Intent-level state saved to current branch (intent branch)
STATE=$(echo "$STATE" | han parse json --set "currentUnit=$UNIT_NAME")
han keep save iteration.json "$STATE"
```

#### Step 3: Read Mode and Spawn Subagent

**CRITICAL: Do NOT execute hat work inline. Always spawn a subagent.**

##### Read operating mode from intent

```bash
# Mode is defined on the intent (set during elaboration)
MODE=$(echo "$STATE" | han parse json mode -r --default OHOTL)

# Also check intent.md frontmatter as source of truth
if [ -f "${INTENT_DIR}/intent.md" ]; then
  MODE=$(han parse yaml mode -r --default "$MODE" < "${INTENT_DIR}/intent.md" 2>/dev/null || echo "$MODE")
fi
```

##### Spawn based on `state.hat`

| Role | Agent Type | Description |
|------|------------|-------------|
| `planner` | `Plan` | Creates tactical implementation plan |
| `builder` | Based on unit `discipline` | Implements the plan |
| `reviewer` | `general-purpose` | Verifies completion criteria |

**Builder agent selection by unit discipline:**
- `frontend` -> `do-frontend-development:presentation-engineer`
- `backend` -> `general-purpose` with backend context
- `documentation` -> `do-technical-documentation:documentation-engineer`
- (other) -> `general-purpose`

##### Example spawn (standard subagents)

```javascript
Task({
  subagent_type: getAgentForRole(state.hat, unit.discipline),
  description: `${state.hat}: ${unit.name}`,
  prompt: `
    Execute the ${state.hat} role for this AI-DLC unit.

    ## CRITICAL: Work in Worktree
    **Worktree path:** ${WORKTREE_PATH}
    **Branch:** ${UNIT_BRANCH}

    You MUST:
    1. cd ${WORKTREE_PATH}
    2. Verify you're on branch ${UNIT_BRANCH}
    3. Do ALL work in that directory
    4. Commit changes to that branch

    ## Unit: ${unit.name}
    ## Completion Criteria
    ${unit.criteria}

    Work according to your role. Return clear status when done.
  `
})
```

The subagent automatically receives AI-DLC context (hat instructions, intent, workflow rules, unit status) via SubagentPrompt injection.

#### Step 4: Handle Subagent Result

Based on the subagent's response:
- **Success/Complete**: Call `/advance` to move to next role (or complete intent if all done)
- **Issues found** (reviewer): Call `/fail` to return to builder
- **Blocked**: Document and stop loop for user intervention

#### Step 5: Loop Behavior

The construction loop is **fully autonomous**. It continues until:
1. **Complete** - All units done, `/advance` marks intent complete
2. **All units blocked** - No forward progress possible, human must intervene
3. **Session exhausted** - Stop hook fires, instructs agent to call `/construct`

**CRITICAL:** The agent MUST auto-continue between units. Do NOT stop after each unit.
