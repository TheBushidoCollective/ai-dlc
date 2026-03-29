---
intent_slug: operations-phase
worktree_path: /Volumes/dev/src/github.com/thebushidocollective/ai-dlc/.ai-dlc/worktrees/operations-phase
project_maturity: established
provider_config: {"spec":null,"ticketing":null,"design":null,"comms":null,"vcsHosting":"github","ciCd":"github-actions"}
---

# Intent Description

Implement the full AI-DLC Operations phase — closing the gap between the 2026 paper's 9-step vision and the plugin's current implementation (steps 5-9 are missing). This includes:

1. **Stack config** — New top-level `stack:` key in settings.yml describing the user's deployment infrastructure (multi-provider: Terraform for infra + Kubernetes for compute + Datadog for monitoring, etc.)

2. **Elaboration expansion** — During elaboration, assess each unit's deployment surface, monitoring requirements, and operational needs. Declare these in unit frontmatter (`deployment:`, `monitoring:`, `operations:` blocks). Auto-create dedicated infrastructure/observability units for larger intents; fold into feature units for small ones.

3. **Completion criteria categories** — Expand from just Functional to: Functional, Deployable, Observable, Operable. Required categories vary by discipline (backend service: all four, library: Functional only, etc.).

4. **Builder expansion** — The Builder produces deployment artifacts (IaC, pipeline config, Dockerfiles), monitoring config (dashboards, alerts, SLOs, KPIs), and operation scripts — all driven by the stack config. New backpressure gates: DEPLOYABLE, OBSERVABLE, OPERATIONS_READY.

5. **Operation scripts** — Self-contained scripts matching the project's language, using the Anthropic SDK for AI reasoning when needed. Each operation is its own file in `.ai-dlc/{intent}/operations/`.

6. **Full manifest generation** — Auto-generate deployment manifests (k8s CronJobs, GitHub Actions workflows, Dockerfiles, etc.) for operations based on stack config.

7. **Reviewer expansion** — Deployment Safety and Observability Completeness become mandatory review agents. Verify deployment artifacts validate, monitoring coverage is complete, operations are tested.

8. **Integration expansion** — Cross-unit deployment compatibility, full stack validation (terraform plan, helm template, pipeline config), no port/resource conflicts, dashboard/alert config validity.

9. **CI/CD deploys** — The agent never deploys directly. The agent ensures the CI/CD pipeline can deploy. The Builder ensures pipeline config exists and handles new services.

10. **`/operate` rewrite** — Management interface for running operations. Supports listing, ad-hoc execution, deployment manifest generation. Each operation is independently addressable: `/operate {intent} {operation}`.

11. **Paper + website updates** — Update the 2026 paper's Operations section and website documentation to reflect the implementation.

## Clarification Answers

- Stack config: New top-level `stack:` key in settings.yml
- Operation language: Match the project's language, use Anthropic SDK in that language
- Signal for deployment/monitoring: Elaboration declares it in unit frontmatter
- Unit scope: Auto-decide — fold for small intents, separate for large
- Deploy targets: Full manifest generation from stack config
- Criteria categories: Required categories vary by discipline
- Scope: Plugin + paper + website docs

## Discovery File Path

/Volumes/dev/src/github.com/thebushidocollective/ai-dlc/.ai-dlc/worktrees/operations-phase/.ai-dlc/operations-phase/discovery.md
