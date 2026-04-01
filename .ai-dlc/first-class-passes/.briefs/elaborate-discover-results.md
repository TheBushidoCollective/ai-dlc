---
status: success
error_message: ""
---

# Discovery Results

## Domain Model Summary

### Entities
- **PassDefinition**: A typed pass with instructions and workflow constraints -- Fields: name, description, available_workflows, default_workflow, instructions (markdown body)
- **Intent**: The overall feature being built -- Fields: workflow, git config, passes (ordered array), active_pass (current), status, units
- **Unit**: A discrete work item within an intent -- Fields: status, depends_on, branch, discipline, pass (which pass it belongs to), workflow
- **Hat**: A role in the construction workflow -- Fields: name, description, instructions (markdown body)
- **Workflow**: A named sequence of hats -- Fields: name, description, hats (ordered array)
- **Settings**: Project-level configuration -- Fields: default_passes, providers, quality_gates, etc.

### Relationships
- Intent has many Units
- Intent has an ordered sequence of Passes (via `passes` array)
- Intent has one active Pass (via `active_pass`)
- Unit belongs to one Pass (via `pass` field)
- PassDefinition constrains available Workflows (via `available_workflows`)
- Workflow defines a sequence of Hats (via `hats` array)
- Hat receives PassDefinition instructions during construction (via hook injection)
- Settings provides default Passes for new Intents (via `default_passes`)
- ProjectPassDefinition augments PluginPassDefinition (same name = append)
- ProjectHat augments PluginHat (same name = append, new name = custom)

### Data Sources
- **Plugin filesystem** (markdown files):
  - Available: hat definitions, skill definitions, workflow definitions, hook scripts, settings schema
  - Missing: pass definition files (`plugin/passes/` directory does not exist)

- **Project filesystem** (`.ai-dlc/` directory):
  - Available: intent.md, unit-*.md, settings.yml, custom workflows, custom hats
  - Missing: custom pass definitions (`.ai-dlc/passes/`)

- **TypeScript parser** (`plugin/shared/src/`):
  - Available: IntentFrontmatter with `passes?` and `active_pass?`, UnitFrontmatter with `pass?`
  - No changes needed to existing types

### Data Gaps
- Pass definition content needs to be authored (design, product, dev instructions)
- Workflow constraint validation behavior when conflicts occur
- Pass-back mechanism details (who triggers, how units are handled)

## Key Findings

- **Pass is currently scheduling-only**: Passes control which units execute but do not influence hat behavior during construction. No pass instructions are injected into hat context.
- **Hat resolution is override, not augment**: Both `inject-context.sh` and `subagent-context.sh` use a pure override pattern where project `.ai-dlc/hats/` completely replaces plugin `hats/`. This needs to change to augmentation (always load plugin, append project).
- **No pass definition files exist**: `plugin/passes/` directory is missing entirely. Three built-in pass files needed (design, product, dev).
- **Settings schema hardcodes pass enum**: `default_passes.items.enum` is `["design", "product", "dev"]`. Must be changed to accept any string to allow custom passes.
- **Paper-implementation mismatch**: Paper shows structured pass objects with per-pass status, but implementation uses flat string arrays. Paper should be updated to match implementation.
- **Existing DAG library is pass-aware**: `dag.sh` already has `find_ready_units_for_pass()` and `parse_unit_pass()` -- minimal DAG changes needed.
- **Provider loading pattern is the right precedent**: `config.sh` `load_provider_instructions()` uses three-tier merge (plugin + settings inline + project override) that should be the model for pass/hat augmentation.
- **Six workflows exist but no pass-to-workflow mapping**: The `design` workflow (`planner -> designer -> reviewer`) is naturally suited for design passes, but no mechanism links them.

## Open Questions

- What specific instructions should each built-in pass definition contain? The design pass should orient hats toward visual/interaction design artifacts; the product pass toward behavioral specs and acceptance criteria; the dev pass toward working code. But the exact wording needs to be drafted.
- When a pass-back occurs (e.g., dev discovers a constraint requiring design rework), should existing units in the target pass be re-elaborated, or should new units be added alongside them?
- Should the `dev` pass definition be loaded by default even for single-pass intents (where `passes: []` and `active_pass: ""`), or should single-pass intents have no pass context injected at all?
- For hat augmentation: should the project augmentation be inserted before or after the canonical plugin instructions? (Proposed: after, as "Project Augmentation" section)

## Mockups Generated

No UI mockups generated -- this intent has no user-facing interface. It is a plugin infrastructure and documentation change.
