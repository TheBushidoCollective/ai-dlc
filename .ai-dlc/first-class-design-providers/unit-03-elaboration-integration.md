---
status: pending
last_updated: ""
depends_on:
  - unit-01-schema-config-capabilities
  - unit-02-design-ref-resolution
branch: ai-dlc/first-class-design-providers/03-elaboration-integration
discipline: backend
pass: ""
workflow: ""
ticket: ""
design_ref: ""
views: []
---

# unit-03-elaboration-integration

## Description
Update the `elaborate-wireframes` skill to delegate wireframe generation to a configured design provider when one is available. When a provider with `generate_wireframe` capability is detected, the skill should generate wireframes using the provider's native tools (MCP or CLI) instead of generating HTML. HTML wireframe generation remains as the explicit fallback when no provider is available.

## Discipline
backend - This unit will be executed by backend-focused agents.

## Domain Entities
- **DesignProvider**: The active design provider, resolved via `detect_design_provider()` from unit-01
- **DesignCapability**: Specifically `generate_wireframe` — checked via `provider_has_capability()` from unit-01
- **DesignArtifact**: The wireframe output — either provider-native format (.op, .pen, Canva design ID) or HTML fallback

## Data Sources
- **elaborate-wireframes/SKILL.md** (`plugin/skills/elaborate-wireframes/SKILL.md`): The skill reads a brief file containing `design_provider_type` field. Currently only uses it to add HTML comments. Needs full provider delegation logic.
- **elaborate/SKILL.md** (`plugin/skills/elaborate/SKILL.md`): Phase 6.25 writes the wireframes brief and invokes the wireframes subagent. The brief's `design_provider_type` field is loaded from `load_providers()`.
- **config.sh** (`plugin/lib/config.sh`): `load_providers()`, `detect_design_provider()`, `provider_has_capability()`, `get_provider_capabilities()` from unit-01.

## Technical Specification

### 1. Elaborate Skill Brief Enhancement (`plugin/skills/elaborate/SKILL.md`)

In Phase 6.25 Step 3, the wireframes brief currently includes `design_provider_type`. Enhance it to also include:
- `design_provider_capabilities`: JSON capabilities object from `get_provider_capabilities()`
- `design_provider_mcp_hint`: MCP tool pattern from `_provider_mcp_hint()` so the subagent knows which tools to search for

### 2. Elaborate-Wireframes Skill Provider Delegation (`plugin/skills/elaborate-wireframes/SKILL.md`)

Add a provider dispatch step before the HTML wireframe generation. The flow becomes:

```
Read brief → Check provider type → If provider available AND has generate_wireframe:
  → Dispatch to provider-specific generation
  → Write native artifact to mockups/
  → Update unit frontmatter with wireframe path and design_ref
  → ALSO generate HTML wireframe as supplementary (for universal viewing)
Else:
  → Generate HTML wireframe (existing behavior, unchanged)
```

### 3. Provider-Specific Generation Instructions

For each provider, the skill includes instructions the subagent follows to generate wireframes:

**Canva:**
1. Call `mcp__claude_ai_Canva__generate-design` with unit description as prompt
2. Get the design ID from the response
3. Call `mcp__claude_ai_Canva__export-design` to get PNG preview
4. Save PNG to `mockups/unit-{NN}-{slug}-wireframe.png`
5. Set `design_ref: canva://design/{id}` in unit frontmatter
6. Set `wireframe: mockups/unit-{NN}-{slug}-wireframe.png` for universal viewing

**OpenPencil (CLI):**
1. Write a prompt file describing the wireframe needed
2. Run `op design --prompt "{description}" --out mockups/unit-{NN}-{slug}-wireframe.op`
3. Run `op export --format png --input mockups/unit-{NN}-{slug}-wireframe.op --output mockups/unit-{NN}-{slug}-wireframe.png`
4. Set `design_ref: mockups/unit-{NN}-{slug}-wireframe.op` in unit frontmatter
5. Set `wireframe: mockups/unit-{NN}-{slug}-wireframe.png`

**OpenPencil (MCP):**
1. Use MCP tools matching `mcp__*openpencil*` — call `design_skeleton` then `design_content` then `design_refine`
2. Export result to PNG
3. Save both .op and .png to mockups/

**Pencil.dev (CLI):**
1. Run `pencil --out mockups/unit-{NN}-{slug}-wireframe.pen --prompt "{description}"`
2. Run `pencil --in mockups/unit-{NN}-{slug}-wireframe.pen --export png --out mockups/unit-{NN}-{slug}-wireframe.png`
3. Set `design_ref: mockups/unit-{NN}-{slug}-wireframe.pen`

**Penpot (MCP):**
1. Use Penpot MCP tools to create design elements
2. Export to PNG via MCP export tool
3. Save PNG to mockups/

**Excalidraw (MCP):**
1. Use Excalidraw MCP `create_element` tools or generate-from-prompt
2. Export to PNG via MCP export
3. Save both .excalidraw and .png to mockups/

**Figma (MCP):**
1. Use Figma Write MCP tools to create design in Figma
2. Export to PNG via `download_figma_images` or `export-design`
3. Set `design_ref: figma://file/{key}` in unit frontmatter

### 4. Fallback Chain

The explicit fallback order is:
1. **Configured provider** (from settings.yml `providers.design.type`)
2. **Auto-detected provider** (from `detect_design_provider()` when type is `auto`)
3. **HTML wireframe** (existing behavior — always works, no external dependencies)

If the provider generation fails (tool unavailable, error, timeout), log the error and fall through to HTML wireframe generation. Never block elaboration on a provider failure.

### 5. Dual Output

When a provider generates a wireframe, ALSO generate the HTML wireframe as a supplementary artifact. This ensures:
- Users without the provider tool installed can still view wireframes in a browser
- The visual review pipeline has a guaranteed PNG/HTML fallback
- The provider-native format is the `design_ref` (high fidelity), while HTML is the `wireframe` (low fidelity)

### 6. Results Brief Update

Update the elaborate-wireframes results brief to include provider information:
```yaml
provider_used: canva  # or openpencil, pencil, html (fallback), etc.
native_artifacts:
  - path: mockups/unit-01-dashboard-wireframe.op
    format: op
    provider: openpencil
```

## Success Criteria
- [ ] When a design provider with `generate_wireframe` capability is available, wireframes are generated using the provider's native tools
- [ ] Provider-native artifacts (.op, .pen, Canva design IDs) are saved to mockups/ directory
- [ ] PNG exports of provider wireframes are saved alongside native artifacts
- [ ] Unit frontmatter `design_ref` is set to the provider-native artifact path or URI
- [ ] HTML wireframe is ALSO generated as supplementary output for universal viewing
- [ ] When no provider is available, HTML wireframe generation works exactly as before (regression-free)
- [ ] Provider generation failures fall through gracefully to HTML wireframe generation
- [ ] Results brief reports which provider was used

## Risks
- **Provider tool availability in subagent context**: The wireframes subagent may not have access to the same MCP tools as the parent agent. Mitigation: include MCP hint patterns in the brief so the subagent can verify tool availability before attempting provider generation.
- **CLI tool not installed**: Users may have a provider configured but not have the CLI installed. Mitigation: check CLI availability with `command -v` before attempting, fall through to MCP tools or HTML fallback.
- **Slow provider generation**: External design tools may be slower than HTML generation. Mitigation: set reasonable timeouts; HTML fallback ensures elaboration isn't blocked.

## Boundaries
This unit does NOT handle: provider config/detection (unit-01), URI resolution to PNG (unit-02), designer hat integration (unit-04), visual review changes (unit-05), or provider schemas (unit-06). It only modifies the elaboration-phase wireframe generation pipeline.

## Notes
- The elaborate-wireframes skill is already invoked as a subagent. Provider delegation adds a dispatch step before the existing HTML generation code.
- The brief file format is the contract between the elaborate skill and the wireframes subagent — any new fields added here must be documented in both skills.
- Canva is the most immediately testable provider since its MCP tools are already connected.
