---
description: Clear all AI-DLC state and start fresh (user-facing command)
---

## Name

`jutsu-ai-dlc:reset` - Clear AI-DLC state and start fresh.

## Synopsis

```
/reset
```

## Description

**User-facing command** - Run this to abandon current task or start fresh.

Clears all AI-DLC state for the current branch. Use this to:
- Start fresh on a new task
- Clean up after completing a task
- Abandon a task that's no longer needed

This only clears AI-DLC state. It does not:
- Undo code changes
- Delete branches
- Revert commits

The work you did is preserved in git. Only the AI-DLC workflow state is cleared.

## Implementation

### Step 1: Confirm (Optional)

If the task is not complete, warn:

```bash
# Intent-level state is on current branch (intent branch)
state=$(han keep load iteration.json --quiet)

status=$(echo "$state" | jq -r '.status // empty')
if [ "$status" != "complete" ]; then
  hat=$(echo "$state" | jq -r '.hat // empty')
  echo "Warning: Task is not complete. Current hat: $hat"
  echo "Are you sure you want to clear all state?"
fi
```

### Step 2: Delete All AI-DLC Keys

```bash
# Clear intent-level state from current branch (intent branch)
han keep delete iteration.json
han keep delete intent.md
han keep delete completion-criteria.md
han keep delete current-plan.md
han keep delete intent-slug

# Clear unit-level state from current branch
han keep delete scratchpad.md
han keep delete blockers.md
han keep delete next-prompt.md
```

### Step 3: Confirm

Output:
```
AI-DLC state cleared.

All iteration data, intent, criteria, and notes have been removed.

To start a new task, run `/elaborate`.
```

## What Gets Cleared

### Intent-Level State (from intent branch)

| Key | Purpose |
|-----|---------|
| `iteration.json` | Hat, iteration count, workflow, status |
| `intent.md` | What we're building |
| `completion-criteria.md` | How we know it's done |
| `current-plan.md` | Plan for current iteration |
| `intent-slug` | Slug identifier |

### Unit-Level State (from current branch)

| Key | Purpose |
|-----|---------|
| `scratchpad.md` | Learnings and notes |
| `blockers.md` | Documented blockers |
| `next-prompt.md` | Continuation prompt |
