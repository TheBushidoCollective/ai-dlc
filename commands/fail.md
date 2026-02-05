---
description: (Internal) Return to the previous hat in the AI-DLC workflow (e.g., reviewer finds issues)
internal: true
---

## Name

`jutsu-ai-dlc:fail` - Return to the previous hat in the AI-DLC workflow.

## Synopsis

```
/fail
```

## Description

**Internal command** - Called by the AI during `/construct`, not directly by users.

Goes back to the previous hat in the workflow. Typically used when:
- Reviewer finds issues → return to builder
- Builder hits fundamental blocker → return to planner
- Planner realizes requirements unclear → return to elaborator

If already at the first hat (elaborator by default), this command is blocked.

## Implementation

### Step 1: Load Current State

```bash
# Intent-level state is stored on current branch (intent branch)
state=$(han keep load iteration.json --quiet)
```

### Step 2: Determine Previous Hat

```javascript
const workflow = state.workflow || ["elaborator", "planner", "builder", "reviewer"];
const currentIndex = workflow.indexOf(state.hat);
const prevIndex = currentIndex - 1;

if (prevIndex < 0) {
  // Already at first hat - cannot go back
  return "Cannot fail before the first hat (elaborator).";
}

const prevHat = workflow[prevIndex];
```

### Step 3: Document Why

Before updating state, save the reason for failing:

```bash
# Append to blockers (unit-level state - saved to current branch)
reason="Reviewer found issues: [describe issues]"
han keep save blockers.md "$reason"
```

### Step 4: Update State

```bash
# Update hat to previous hat
# Intent-level state saved to current branch (intent branch)
updated_state=$(echo "$state" | jq --arg hat "$prevHat" '.hat = $hat')
han keep save iteration.json "$updated_state"
```

### Step 5: Confirm

Output:
```
Returning to **{prevHat}** hat.

**Reason:** {reason}

Continuing construction with the previous hat...
```

## Guard

If already at the first hat (elaborator by default), output:
```
You are at the first hat (elaborator).

Cannot go back further. Continue elaboration or use `/reset` to start over.
```
