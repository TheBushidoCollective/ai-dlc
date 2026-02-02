---
title: Quick Start
description: Get started with AI-DLC in 5 minutes
order: 2
---

# Quick Start

Get AI-DLC running in your project in 5 minutes.

## Installation

Install the AI-DLC plugin in your Claude Code session:

```
/install-plugin thebushidocollective/ai-dlc
```

The plugin will be added to your project's Claude Code configuration.

## Basic Usage

### Switching Hats

Use the hat commands to switch between modes:

```
/researcher   # Enter research mode
/planner      # Enter planning mode
/builder      # Enter building mode
/reviewer     # Enter review mode
```

Each command switches your context and loads the appropriate system prompt for that phase.

### Defining a Unit

Before starting work, define your unit of work with clear criteria:

```
/unit "Add user authentication"
- Users can register with email/password
- Users can log in with credentials
- Sessions persist across browser refreshes
- Invalid credentials show error messages
```

### Working Through Phases

**Research Phase**
```
/researcher
Let's understand the current codebase and authentication requirements...
```

**Planning Phase**
```
/planner
Based on our research, here's the implementation plan...
```

**Building Phase**
```
/builder
Implementing the authentication system as planned...
```

**Review Phase**
```
/reviewer
Let's verify all success criteria are met...
```

## Next Steps

- Read the [Core Concepts](/docs/concepts/) guide
- Learn about [Units of Work](/docs/units/)
- Explore the [Hat System](/docs/hats/)
