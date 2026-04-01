---
intent: first-class-design-providers
created: 2026-04-01
status: active
---

# Discovery Log: First-Class Design Providers

Elaboration findings persisted during Phase 2.5 domain discovery.
Builders: read section headers for an overview, then dive into specific sections as needed.

## Codebase Context

**Stack:** TypeScript (Next.js 15 website, MCP server), Bash (plugin hooks/libs), JSON schemas
**Build Tools:** Bun (lockfile present), Biome (linting), Playwright (testing/screenshots)
**Architecture:** Monorepo with 4 workspaces: `website/`, `plugin/shared/`, `plugin/mcp-server/`, `plugin/cli/`
**Package Manager:** Bun (bun.lock present) with npm fallback (package-lock.json also present)
**Conventions:**
- Plugin skills in `plugin/skills/{name}/SKILL.md` (markdown-driven agent instructions)
- Hats in `plugin/hats/{name}.md` (role definitions for workflow phases)
- Providers in `plugin/providers/{category}.md` (tiered instruction system: built-in, inline, project override)
- Provider schemas in `plugin/schemas/providers/{type}.schema.json`
- Settings schema in `plugin/schemas/settings.schema.json`
- Shell libraries in `plugin/lib/*.sh` (sourced by hooks and CLI)
- MCP server in `plugin/mcp-server/src/server.ts` (Node.js, @modelcontextprotocol/sdk)
- Workflows in `plugin/workflows.yml` (named hat sequences)
- Passes in `plugin/passes/{name}.md` (discipline iteration definitions)
**Concerns:**
- `resolve-design-ref.sh` line 118: Provider URIs (e.g., `figma://`) are explicitly stubbed as "not yet supported" with a fallthrough
- `designProviderEntry` in settings schema only supports `"figma"` as a type enum value
- `_provider_mcp_hint` in config.sh only maps `figma` for the design category
- The design provider instructions (`plugin/providers/design.md`) are generic and don't reference any specific MCP tools
- No provider schemas exist for any design tool except Figma (`figma.schema.json`)
- The elaborate skill only mentions Figma when checking for design providers (line 353)

