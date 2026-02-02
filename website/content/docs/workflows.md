---
title: Workflows
description: Named workflow patterns in AI-DLC - Default, TDD, Adversarial, and Hypothesis
order: 5
---

# Workflows

AI-DLC provides four named workflows, each optimized for different types of work. Choose the workflow that matches your task.

## What Is a Workflow?

A workflow is a named sequence of hats. Each workflow defines:
- Which hats are used
- The order of transitions
- The operating mode for each hat

Workflows are selected during `/elaborate` and can be customized per project.

## Default Workflow

The standard development workflow for most feature work.

### Hats

| Hat | Mode | Focus |
|-----|------|-------|
| Elaborator | HITL | Define intent and criteria with user |
| Planner | HITL | Create tactical plan for the unit |
| Builder | OHOTL | Implement according to plan |
| Reviewer | HITL | Verify implementation meets criteria |

### Flow

```
/elaborate
    ↓
Elaborator (HITL): Define what to build
    ↓
/construct
    ↓
Planner (HITL): Plan how to build it
    ↓
Builder (OHOTL): Build it
    ↓
Reviewer (HITL): Verify it's done
    ↓
Next unit or intent complete
```

### When to Use

- Standard feature development
- General enhancements
- Most CRUD operations
- Integration work

### Example

**Intent:** Add user profile editing

```
Elaborator: "What fields should users edit?"
You: "Name, email, avatar image"

Planner: "I'll add an /api/profile endpoint, a ProfileForm
component, and image upload with size validation."

Builder: [Implements the plan]

Reviewer: "All criteria met. Users can edit name, email,
upload avatar. Tests pass. Ready for review."
```

## TDD Workflow

Test-Driven Development: Red-Green-Refactor pattern.

### Hats

| Hat | Mode | Focus |
|-----|------|-------|
| Test Writer | OHOTL | Write failing tests first |
| Implementer | OHOTL | Make tests pass with minimal code |
| Refactorer | OHOTL | Improve code while keeping tests green |

### Flow

```
/elaborate (select TDD workflow)
    ↓
/construct
    ↓
Test Writer (OHOTL): Write tests that fail
    ↓
Implementer (OHOTL): Make tests pass
    ↓
Refactorer (OHOTL): Clean up the code
    ↓
All tests still pass? → Next unit
```

### When to Use

- Well-specified behavior (API contracts, business rules)
- Bug fixes (write test that reproduces, then fix)
- Refactoring with safety net
- When you want tests as living documentation

### Example

**Intent:** Fix payment calculation bug

```
Test Writer: "Writing test that reproduces the bug:
  test('applies discount before tax, not after')"

Implementer: "Test fails as expected. Fixing calculation
order in applyDiscount()... Test passes."

Refactorer: "Extracting discount logic to separate
function for clarity. All tests still green."
```

### Philosophy

> "Write the tests you wish you had."

The Test Writer doesn't just write any tests - it writes the tests that would have caught the bug or validated the feature from the start.

## Adversarial Workflow

Security-focused development with Red/Blue team phases.

### Hats

| Hat | Mode | Focus |
|-----|------|-------|
| Builder | OHOTL | Implement to specification |
| Red Team | OHOTL | Attack - find vulnerabilities |
| Blue Team | OHOTL | Defend - fix vulnerabilities |
| Reviewer | HITL | Final security review |

### Flow

```
/elaborate (select adversarial workflow)
    ↓
/construct
    ↓
Builder (OHOTL): Implement the feature
    ↓
Red Team (OHOTL): Try to break it
    ↓
Blue Team (OHOTL): Fix what was found
    ↓
Reviewer (HITL): Final security validation
    ↓
Secure? → Complete
```

### When to Use

- Authentication/authorization features
- Payment processing
- Data handling with privacy implications
- API endpoints exposed to public
- Features handling sensitive data

### Example

**Intent:** Add API key management

```
Builder: "Implemented API key generation, storage,
and validation endpoints."

Red Team: "Found issues:
1. Keys stored in plaintext (should hash)
2. No rate limiting on key validation
3. Timing attack possible on key comparison"

Blue Team: "Fixed all issues:
1. Now using bcrypt for key hashes
2. Added rate limiting (100/min)
3. Using constant-time comparison"

Reviewer: "Verified fixes. Security scan passes.
Approved for production."
```

### Philosophy

The adversarial workflow assumes every feature is a potential attack surface. By switching between attacker and defender mindsets, you build more secure software.

## Hypothesis Workflow

Scientific debugging for investigating complex bugs.

### Hats

| Hat | Mode | Focus |
|-----|------|-------|
| Observer | OHOTL | Gather data about the bug |
| Hypothesizer | HITL | Form theories about the cause |
| Experimenter | OHOTL | Test hypotheses systematically |
| Analyst | HITL | Evaluate results and implement fix |

### Flow

```
/elaborate (select hypothesis workflow)
    ↓
/construct
    ↓
Observer (OHOTL): Collect symptoms, logs, traces
    ↓
Hypothesizer (HITL): Form ranked hypotheses
    ↓
Experimenter (OHOTL): Test each hypothesis
    ↓
Analyst (HITL): Interpret results, implement fix
    ↓
Bug fixed? → Complete
```

### When to Use

- Intermittent/flaky bugs
- Performance issues with unknown cause
- Production incidents
- Bugs that "shouldn't happen"
- Complex system interactions

### Example

**Intent:** Fix intermittent 500 errors on checkout

```
Observer: "Gathered data:
- Errors occur ~2% of requests
- More frequent during peak hours
- Stack trace shows DB timeout
- No correlation with specific users"

Hypothesizer: "Ranked hypotheses:
1. Connection pool exhaustion under load
2. Slow query blocking connections
3. Database resource contention
4. Network latency spikes"

Experimenter: "Testing hypothesis #1:
- Added connection pool metrics
- Found: pool exhausted at 25 connections
- Peak requires ~40 connections"

Analyst: "Root cause confirmed. Fix:
- Increased pool size to 50
- Added connection timeout handling
- Monitoring shows 0% error rate for 24h"
```

### Philosophy

> "Don't guess - investigate."

The hypothesis workflow prevents "shotgun debugging" (changing random things hoping to fix the bug). Each change is a controlled experiment testing a specific hypothesis.

## Choosing a Workflow

| Task Type | Workflow | Why |
|-----------|----------|-----|
| New feature | Default | Balanced plan-build-review cycle |
| Bug fix (known cause) | TDD | Test reproduces bug, verifies fix |
| Bug fix (unknown cause) | Hypothesis | Systematic investigation |
| Security-sensitive | Adversarial | Built-in security validation |
| Performance work | Hypothesis | Data-driven optimization |
| Refactoring | TDD | Tests provide safety net |

## Custom Workflows

Create project-specific workflows in `.ai-dlc/workflows.yml`:

```yaml
workflows:
  research-first:
    description: Research before building
    hats: [elaborator, researcher, planner, builder, reviewer]

  design-heavy:
    description: UX-focused with design phase
    hats: [elaborator, designer, builder, reviewer]

  quick-fix:
    description: Minimal overhead for trivial changes
    hats: [builder, reviewer]
```

## Next Steps

- **[Hats](/docs/hats/)** - Detailed reference for each hat
- **[Example: Feature Implementation](/docs/example-feature/)** - Default workflow in action
- **[Example: Bug Fix](/docs/example-bugfix/)** - Hypothesis workflow in action
