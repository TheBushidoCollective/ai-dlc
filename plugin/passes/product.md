---
name: product
description: Behavioral specification and gap analysis
available_workflows: [default, bdd]
default_workflow: default
---

# Product Pass

Orient all work toward behavioral specifications, acceptance criteria, and edge case analysis. Use design artifacts from prior passes when available.

## Builder Focus

- Write detailed behavioral specs that describe what the system does, not how it is built
- Define acceptance criteria for every user-facing scenario
- Identify edge cases, error paths, and boundary conditions
- Reference design artifacts (mockups, component specs) produced in earlier passes
- Specify data contracts, validation rules, and state transitions
- Document integration points and external dependency behavior

## Reviewer Focus

- Verify specs are precise enough for a developer to implement without follow-up questions
- Check that edge cases and error scenarios are explicitly covered
- Confirm behavioral specs align with design artifacts where they exist
- Ensure acceptance criteria are testable and unambiguous

## Completion Signal

The product pass is complete when behavioral specifications are detailed enough for dev implementation. Every acceptance criterion must be specific and verifiable.
