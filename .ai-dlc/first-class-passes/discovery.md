---
intent: first-class-passes
created: 2026-03-31
status: active
---

# Discovery Log: First-Class Passes

Elaboration findings persisted during Phase 2.5 domain discovery.
Builders: read section headers for an overview, then dive into specific sections as needed.

## Codebase Context

**Stack:** Shell (hooks/lib), TypeScript (shared parser, CLI dashboard, MCP server), Next.js 15 (website)
**Architecture:** Monorepo with three components — plugin (Claude Code plugin), website (Next.js static site), paper (methodology spec). Plugin uses bash hooks and SKILL.md-based agent orchestration.
**Build tools:** Bun (lockfile present: `bun.lock`), Biome (linting/formatting), npm workspaces (`website`, `plugin/shared`, `plugin/mcp-server`, `plugin/cli`)
**Conventions:** YAML frontmatter in markdown files for metadata, bash hooks for lifecycle events, shell libraries in `plugin/lib/`, hat definitions as markdown in `plugin/hats/`, skills as `SKILL.md` files in `plugin/skills/{name}/`
**Concerns:** Hat resolution currently uses override semantics (project `.ai-dlc/hats/` replaces plugin `hats/`), needs to change to augmentation. No pass definition files exist yet (`plugin/passes/` directory missing). Pass types are hardcoded as an enum in settings schema.

## Codebase Pattern: Current Pass Implementation

Passes currently exist as a scheduling/metadata concept only -- they control which units execute in a given phase but do NOT influence how hats behave during construction. Here is a comprehensive map of every file that touches passes:

### Data Model (types.ts)
- `IntentFrontmatter.passes?: string[]` -- ordered pass array on the intent
- `IntentFrontmatter.active_pass?: string` -- currently active pass
- `UnitFrontmatter.pass?: string` -- which pass a unit belongs to

### Settings Schema (settings.schema.json)
- `default_passes` property: `type: "array"`, items: `enum: ["design", "product", "dev"]`
- **Problem:** Hardcoded enum. Custom passes (e.g., "security", "accessibility") cannot be added without schema changes.
- Default is `[]` (empty = single implicit dev pass)

### Elaborate Skill (Phase 5.95)
- Reads `default_passes` from `.ai-dlc/settings.yml` via yq
- If <2 entries: sets `passes: []`, `active_pass: ""` (skip)
- If >=2 entries: sets `passes` to configured array, `active_pass` to first entry
- Override via `.ai-dlc/{intent}/settings.yml`
- Unit template includes `pass: ""` field

### Execute Skill (Step 5c completion)
- On intent completion, checks for next pass in the sequence
- Parses `passes:` and `active_pass:` from intent.md via grep/sed
- If next pass exists: updates `active_pass`, notifies user to re-elaborate, saves `status=pass_transition`
- If no next pass: marks intent complete

### DAG Library (dag.sh)
- `parse_unit_pass()` function extracts `pass` field from unit frontmatter
- `find_ready_units_for_pass()` function filters ready units by active_pass
- When `active_pass` is empty, returns all ready units (backward compatible)

### Hook Injection (inject-context.sh and subagent-context.sh)
- **inject-context.sh** (lines 615-665): Hat resolution uses override pattern:
  1. Check `.ai-dlc/hats/${HAT}.md` (project override)
  2. If not found, check `${PLUGIN_ROOT}/hats/${HAT}.md` (plugin built-in)
  - Project file completely replaces plugin file (no augmentation)
  - **No pass context is injected** -- hats get no awareness of the active pass
- **subagent-context.sh** (lines 186-214): Same override pattern for hat resolution
  - Again, project `.ai-dlc/hats/` completely replaces plugin hats
  - No pass context injection

### Paper Documentation
- **Section: "Iteration Through Passes"** (line 373): Well-documented conceptual model with mermaid diagram showing design/product/dev passes with backward flow
- **Glossary entry "Pass"** (line 698): Documents pass structure, built-in types table, and frontmatter format
- **Note:** The paper shows pass frontmatter as `- type: design / status: completed` (structured objects), but the actual implementation uses flat string arrays (`passes: [design, dev]`). This is a paper-implementation mismatch.

### Website Docs (concepts.md)
- Lines 61-87: Pass types table, configuration example, basic explanation
- Lines 355-380: "When to Use Passes" section, backward flow diagram
- Fairly complete but lacks detail on pass-backs and lifecycle

### Workflows (workflows.yml)
- 6 named workflows: default, adversarial, design, hypothesis, tdd, bdd
- **No pass-to-workflow mapping** -- passes don't constrain which workflows are available
- The `design` workflow uses `[planner, designer, reviewer]` hats -- this is relevant for design passes but there's no mechanism linking them

### What's Missing (The Gap)
1. **No pass definition files** -- `plugin/passes/` directory doesn't exist
2. **No pass-to-hat context injection** -- hats don't know what pass they're in
3. **No per-pass workflow constraints** -- any workflow can be used in any pass
4. **No project-level pass customization** -- can't add/augment passes per project
5. **Hat resolution is override-only** -- project hats replace, not augment
6. **Settings schema hardcodes pass enum** -- can't add custom pass types
7. **Paper-implementation mismatch** on pass frontmatter format

