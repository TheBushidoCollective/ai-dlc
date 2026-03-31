---
name: dev
description: Working implementation
available_workflows: [default, tdd, adversarial, bdd]
default_workflow: default
---

# Dev Pass

Orient all work toward tested, deployable code. Use design and product artifacts from prior passes as source-of-truth inputs.

## Builder Focus

- Implement production code that satisfies behavioral specs and acceptance criteria
- Write tests that verify every acceptance criterion programmatically
- Follow design specs for UI components, tokens, and interaction behavior
- Ensure all quality gates pass (lint, type-check, test suite)
- Keep commits small, focused, and independently verifiable

## Reviewer Focus

- Verify implementation matches behavioral specs from the product pass
- Confirm UI implementation matches design artifacts from the design pass
- Check test coverage against acceptance criteria
- Validate that quality gates pass without suppression or workarounds
- Review for security, performance, and maintainability concerns

## Completion Signal

The dev pass is complete when all acceptance criteria have passing tests, quality gates are green, and the implementation is ready for integration. All criteria must be programmatically verifiable.
