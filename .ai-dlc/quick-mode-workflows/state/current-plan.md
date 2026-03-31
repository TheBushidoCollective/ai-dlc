# Plan: unit-02-intelligent-routing

## Summary

Add static routing heuristic text to `plugin/hooks/inject-context.sh` in both the greenfield and established "no active task" code paths. The text guides the agent to assess task scope and suggest either `/quick` or `/elaborate` to the user, with workflow recommendations.

## What Changes

**File:** `plugin/hooks/inject-context.sh` (ONLY file modified)

**Change type:** Static `echo` statements added — no new bash functions, no new logic, no control flow changes.

## Insertion Points

### Point 1: Greenfield Path (after line 204)

Current code (lines 200-205):
```bash
    if [ -n "$AVAILABLE_WORKFLOWS" ]; then
      echo "**Available workflows:**"
      echo "$AVAILABLE_WORKFLOWS"
      echo ""
    fi
    exit 0
```

**Insert AFTER the `fi` on line 204, BEFORE `exit 0` on line 205.** Add the routing heuristic echo block here.

### Point 2: Established Path (after line 335)

Current code (lines 332-337):
```bash
      echo "**Available workflows:**"
      echo "$AVAILABLE_WORKFLOWS"
      echo ""
    fi
  fi
  exit 0
```

**Insert AFTER the inner `fi` on line 336, BEFORE the outer `fi` on line 337.** Add the same routing heuristic echo block here.

## Routing Heuristic Text Content

The SAME block of static text is inserted at both points. The text must be under 40 lines total and include:

### Structure (~28 echo lines)

1. **Section header:** `### Task Routing`
2. **Instruction:** When the user describes a task without using a slash command, assess scope and suggest either `/ai-dlc:quick` or `/ai-dlc:elaborate`.
3. **Scope signals table:**

| Signal | → Quick | → Elaborate |
|--------|---------|-------------|
| Files touched | 1-2 files | 3+ files or cross-cutting |
| Nature | Typo, rename, config tweak, lint fix | New feature, refactor, architecture |
| Tests needed | None or existing pass | New tests required |
| Design decisions | None | Any |

4. **Workflow suggestion mapping:**
   - Simple fix/typo/rename → `/ai-dlc:quick <task>`
   - Bug investigation → suggest `hypothesis` workflow
   - UI/UX task → suggest `design` workflow
   - Security concern → suggest `adversarial` workflow
   - TDD approach → suggest `tdd` workflow
   - New feature / multi-file → `/ai-dlc:elaborate`

5. **Syntax:** `/ai-dlc:quick [workflow] <task description>` or `/ai-dlc:elaborate`
6. **Always-confirm:** "Always confirm your routing suggestion with the user before proceeding."

## Steps to Execute

1. **Add routing text after greenfield workflows block** (after line 204 `fi`, before line 205 `exit 0`)
   - Add echo statements for the routing heuristic
   - Indentation: 4 spaces (matching surrounding code in greenfield block)

2. **Add identical routing text after established workflows block** (after line 336 inner `fi`, before line 337 outer `fi`)
   - Same echo statements
   - Indentation: 4 spaces (matching surrounding code in established block)

3. **Verify no other changes** — active intent detection, hat injection, resumable intent discovery, and all other hook functions must remain identical

4. **Run lint** — `bun run lint`

## What NOT to Change

- No new bash functions or variables
- No changes to the active-intent code path (line 340+)
- No changes to the resumable-intents discovery (lines 208-309)
- No changes to workflow parsing, provider injection, or any other existing logic
- No other files modified
