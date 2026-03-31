---
intent_slug: design-direction-system
worktree_path: /home/user/ai-dlc/.ai-dlc/worktrees/design-direction-system
project_maturity: established
provider_config: {}
---

# Intent Description

Build a "Design Direction System" that injects visual and structural variation into AI-generated interfaces during the elaboration phase. The system presents greenfield projects with a visual design direction picker (via the MCP server's browser UI) where users browse design archetypes, tweak parameters, and choose a direction. The chosen direction produces a "design blueprint" artifact in the repo and drives styled wireframe generation — so that AI-built interfaces don't all converge on the same cookie-cutter SaaS dashboard look.

Key principles:
- Design belongs in elaboration (forethought), not construction (afterthought)
- Only activates for greenfield projects — established projects with existing design systems are respected
- Both layout/structural variation AND visual personality variation
- The MCP visual picker lets users see and compare directions visually before choosing
- Chosen direction flows into wireframes (styled, not just gray boxes) and a design blueprint artifact
- When brownfield, use existing component libraries from the project

## Design Archetypes (initial set)
1. **Brutalist** — High contrast, raw borders, intentional roughness, asymmetric grids, monospace type
2. **Editorial** — Magazine-inspired layouts, strong typography hierarchy, generous whitespace, editorial grid systems
3. **Dense / Utilitarian** — Dense information display, minimal chrome, keyboard-first, data tables and compact controls
4. **Playful / Warm** — Rounded corners, vibrant colors, playful micro-interactions, illustrated empty states

## Tunable Parameters
1. **Density** — How much whitespace vs information density (airy editorial → packed dashboard)
2. **Expressiveness** — How much personality the interface shows (strictly functional → expressive and opinionated)
3. **Shape language** — Rounded/soft vs sharp/geometric vs organic/irregular
4. **Color mood** — Warm/cool/monochrome mood direction

## Clarification Answers

**Where should variation be introduced?**
User believes design fundamentally belongs in elaboration, not in construction. While some teams may opt for a design construction pass, design is really forethought to implementation. So the design direction system lives in the elaboration flow.

**What kind of variation matters?**
All of the above — layout & structure, visual personality, and full interface feel. The whole interface should feel like it was designed with intent, not generated.

**Scope:**
Greenfield only — established projects with existing design systems should respect their existing patterns.

**Mechanism:**
A visual picker driven by the AI-DLC MCP server that gives users a browser-based UI to pick through design directions and tweak parameters. Those parameters get passed back to the Claude session and drive design decisions, and write a design blueprint to the repo.

**Wireframes:**
Styled wireframes that reflect the chosen direction. If possible, use existing components from a component library already present in brownfield apps.

## Discovery File Path

/home/user/ai-dlc/.ai-dlc/worktrees/design-direction-system/.ai-dlc/design-direction-system/discovery.md
