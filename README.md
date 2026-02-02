# AI-DLC 2026

**AI-Driven Development Lifecycle** - A methodology for iterative AI-driven development with hat-based workflows.

## Overview

AI-DLC 2026 is a structured approach to AI-assisted software development that uses role-based "hats" to organize work into focused, iterative cycles. Each hat represents a specific mindset and set of responsibilities:

- **Researcher** - Gather context and understand requirements
- **Planner** - Design implementation approach
- **Builder** - Execute the plan
- **Reviewer** - Validate quality and completeness

## Repository Structure

```
ai-dlc/
  website/     # Documentation site (ai-dlc.dev)
  plugin/      # Claude Code plugin
```

## Quick Start

### Install the Plugin

```bash
# Via Han marketplace
han plugin install ai-dlc

# Or directly in Claude Code
/plugin install bushido@ai-dlc
```

### Visit the Documentation

[https://ai-dlc.dev](https://ai-dlc.dev)

## Development

This is a bun workspace monorepo.

```bash
# Install dependencies
bun install

# Run website locally
bun run dev

# Build all packages
bun run build

# Lint/format
bun run lint
bun run format
```

## License

Apache-2.0 - See [LICENSE](LICENSE) for details.
