# Tactical Plan: unit-01-quick-skill-rewrite — Bolt 1

## Objective

Rewrite `plugin/skills/quick/SKILL.md` from a 7-step linear flow into a workflow-aware hat loop with subagent delegation. The rewritten skill creates a temporary `.ai-dlc/quick/` artifact so the existing hook system (`subagent-context.sh`, `inject-context.sh`) injects hat context automatically — zero hook modifications needed.

## Tasks

### Task 1: Rewrite SKILL.md frontmatter and header
Update the skill frontmatter to accept `[workflow] <task>` argument format. Update the header section (name, description, when-to-use/when-not-to-use). Preserve the scope guidance from the current skill.

### Task 2: Implement argument parsing section
Write the argument parsing logic that reads `plugin/workflows.yml` and `.ai-dlc/workflows.yml`, merges them (project overrides plugin), tests if first word matches a known workflow name. If match: use that workflow, rest is task description. If no match: use `default` workflow.

### Task 3: Implement pre-checks section
Three pre-checks: cowork rejection, active intent conflict (orphaned artifact detection), scope validation.

### Task 4: Implement quick artifact creation
Create `.ai-dlc/quick/` with intent.md + state/iteration.json. Add `.ai-dlc/quick/` to `.gitignore`.

### Task 5: Implement hat loop (core)
For each hat in the resolved workflow: update iteration.json, display hat transition, spawn subagent (hook system injects hat context), process result by hat archetype. Reviewer rejection loops back to builder (max 3 cycles).

### Task 6: Implement cleanup and completion
Remove `.ai-dlc/quick/` regardless of success/failure. Output completion report.

### Task 7: Write guardrails section
Document evolved guardrails.

### Task 8: Verify hook integration (F003)
Include fallback for manual hat file injection if hooks don't fire for Agent calls from skills.

### Task 9: Lint verification
Run `bun run lint` after all changes.

## Risks
1. F003: PreToolUse hooks may not fire for Agent calls from within a skill (Low)
2. Workflow YAML parsing edge cases (Medium)
3. Active intent detection race (Low)
4. Orphaned artifact on crash (Medium)
5. Skill file length (Medium)
