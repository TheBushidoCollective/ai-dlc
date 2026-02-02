---
title: The Four Hats
description: Understanding the hat-based workflow system
order: 3
---

# The Four Hats

AI-DLC uses a "hat" metaphor to separate concerns. Each hat represents a distinct mindset, set of responsibilities, and communication style.

## Why Hats?

The hat system prevents:

- **Context drift**: Accidentally switching between research and building
- **Scope creep**: Building features that weren't planned
- **Quality shortcuts**: Skipping review to "just ship it"
- **Analysis paralysis**: Over-researching without building

By explicitly switching hats, you maintain focus and ensure each phase gets proper attention.

## Researcher Hat

**Goal**: Understand the problem space before acting.

**Activities**:
- Reading existing code
- Reviewing requirements and specifications
- Exploring similar implementations
- Identifying constraints and edge cases
- Building a mental model of the system

**Output**: A clear understanding of what needs to be built and why.

**Commands**: `/researcher`

## Planner Hat

**Goal**: Design the implementation approach.

**Activities**:
- Breaking work into steps
- Identifying dependencies
- Considering edge cases
- Evaluating trade-offs
- Creating actionable plans

**Output**: A step-by-step plan that the Builder can follow.

**Commands**: `/planner`

## Builder Hat

**Goal**: Execute the plan and write code.

**Activities**:
- Implementing features
- Writing tests
- Handling edge cases
- Following the plan without deviation
- Creating clear, maintainable code

**Output**: Working code that implements the planned functionality.

**Commands**: `/builder`

## Reviewer Hat

**Goal**: Validate quality and completeness.

**Activities**:
- Running tests
- Checking success criteria
- Reviewing code quality
- Verifying edge cases
- Ensuring documentation is complete

**Output**: Confirmation that work is ready for production.

**Commands**: `/reviewer`

## Hat Transitions

The typical flow is: **Researcher → Planner → Builder → Reviewer**

However, you can transition back when needed:

- **Builder → Researcher**: When you discover you need more context
- **Reviewer → Builder**: When review identifies issues to fix
- **Planner → Researcher**: When planning reveals knowledge gaps

The key is making transitions *intentional*. Don't drift - explicitly switch.

## Tips for Effective Hat Usage

1. **Announce your hat**: Start each phase by explicitly stating which hat you're wearing
2. **Stay in character**: Resist the urge to jump ahead to building while researching
3. **Time-box when needed**: If you're stuck in research, set a limit and move to planning
4. **Trust the process**: Even when you "know" the answer, research often reveals surprises
