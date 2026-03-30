---
title: Stack Configuration Reference
description: Reference for .ai-dlc/settings.yml stack layers — infrastructure, compute, packaging, pipeline, secrets, monitoring, alerting, and operations
order: 7
---

The stack configuration describes your project's infrastructure in `.ai-dlc/settings.yml` under the `stack:` key. AI-DLC uses this configuration to generate deployment manifests, validate operations, and tailor advice to your environment.

All layers are optional. An empty stack (`stack: {}`) is valid — AI-DLC will infer what it can from project files.

## Layer Reference

### Infrastructure

Defines how infrastructure is provisioned.

```yaml
stack:
  infrastructure:
    - provider: terraform  # terraform | cloudformation | pulumi
      state_backend: s3
      modules_path: infra/modules/
```

**Providers:** `terraform`, `cloudformation`, `pulumi`

### Compute

Defines where workloads run.

```yaml
stack:
  compute:
    - provider: kubernetes  # kubernetes | ecs | lambda | docker-compose
      cluster: production
      namespace: default
```

**Providers:** `kubernetes`, `ecs`, `lambda`, `docker-compose`

### Packaging

Defines how applications are packaged for deployment.

```yaml
stack:
  packaging:
    - provider: helm  # helm | kustomize | raw
      charts_path: deploy/charts/
```

**Providers:** `helm`, `kustomize`, `raw`

### Pipeline

Defines CI/CD pipeline configuration.

```yaml
stack:
  pipeline:
    - provider: github-actions  # github-actions | gitlab-ci | jenkins | circleci
      workflows_path: .github/workflows/
```

**Providers:** `github-actions`, `gitlab-ci`, `jenkins`, `circleci`

### Secrets

Defines secrets management.

```yaml
stack:
  secrets:
    - provider: vault  # vault | aws-sm | gcp-sm | env
      path: secret/data/app
```

**Providers:** `vault`, `aws-sm`, `gcp-sm`, `env`

### Monitoring

Defines observability stack.

```yaml
stack:
  monitoring:
    - provider: prometheus  # prometheus | datadog | cloudwatch | newrelic | otel
      endpoint: http://prometheus:9090
```

**Providers:** `prometheus`, `datadog`, `cloudwatch`, `newrelic`, `otel`

### Alerting

Defines alerting and incident management.

```yaml
stack:
  alerting:
    - provider: pagerduty  # pagerduty | opsgenie | datadog | alertmanager
      service_id: P123ABC
```

**Providers:** `pagerduty`, `opsgenie`, `datadog`, `alertmanager`

### Operations

Defines the operations runtime and configuration.

```yaml
stack:
  operations:
    runtime: node  # node | python | go | shell
    scheduled:
      - name: cleanup
        schedule: "0 3 * * *"
        command: node scripts/cleanup.js
    reactive:
      - name: alert-handler
        trigger: webhook
        command: node scripts/handle-alert.js
```

**Runtimes:** `node`, `python`, `go`, `shell`

When `runtime` is not specified, AI-DLC auto-detects from project files:
- `package.json` → `node`
- `pyproject.toml` or `requirements.txt` → `python`
- `go.mod` → `go`
- Default → `shell`

## Examples

### Simple — Solo Developer

A minimal setup with just CI and basic monitoring:

```yaml
stack:
  pipeline:
    - provider: github-actions
  monitoring:
    - provider: datadog
```

### Medium — Small Team

A typical team setup with container orchestration, CI, monitoring, and operations:

```yaml
stack:
  compute:
    - provider: kubernetes
      cluster: staging
      namespace: app
  pipeline:
    - provider: github-actions
      workflows_path: .github/workflows/
  monitoring:
    - provider: prometheus
      endpoint: http://prometheus:9090
  alerting:
    - provider: pagerduty
      service_id: P456DEF
  operations:
    runtime: node
    scheduled:
      - name: cleanup
        schedule: "0 3 * * *"
        command: node scripts/cleanup.js
```

### Complex — Enterprise

A fully populated stack for a large-scale production environment:

```yaml
stack:
  infrastructure:
    - provider: terraform
      state_backend: s3
      modules_path: infra/modules/
  compute:
    - provider: kubernetes
      cluster: prod-us-east-1
      namespace: platform
  packaging:
    - provider: helm
      charts_path: deploy/charts/
  pipeline:
    - provider: github-actions
      workflows_path: .github/workflows/
  secrets:
    - provider: vault
      path: secret/data/platform
  monitoring:
    - provider: otel
      endpoint: http://otel-collector:4317
  alerting:
    - provider: pagerduty
      service_id: P789GHI
  operations:
    runtime: node
    scheduled:
      - name: cleanup
        schedule: "0 3 * * *"
        command: node scripts/cleanup.js
    reactive:
      - name: alert-handler
        trigger: webhook
        command: node scripts/handle-alert.js
```

## Telemetry Events

AI-DLC emits structured [OpenTelemetry](https://opentelemetry.io/) events at key lifecycle boundaries. These events enable teams to measure methodology effectiveness, diagnose workflow bottlenecks, and build dashboards over their development process.

### Configuration

Enable telemetry by setting environment variables:

| Variable | Purpose | Default |
|----------|---------|---------|
| `CLAUDE_CODE_ENABLE_TELEMETRY` | Set to `1` to enable telemetry | Disabled |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Collector endpoint | `http://localhost:4317` |
| `OTEL_EXPORTER_OTLP_HEADERS` | Auth headers (`key1=value1,key2=value2`) | None |
| `OTEL_RESOURCE_ATTRIBUTES` | Custom resource attributes | None |

All events are sent as OTLP/JSON structured logs with service name `ai-dlc` and version tracked from `plugin.json`. All calls are async and fail-silent — telemetry never blocks the workflow.

### Event Catalog

| Event | Description | Key Attributes |
|-------|-------------|----------------|
| `ai_dlc.intent.created` | Fired when a new intent is created during elaboration | `intent_slug`, `strategy` |
| `ai_dlc.intent.completed` | Fired when all units complete and intent is marked done | `intent_slug`, `unit_count` |
| `ai_dlc.elaboration.complete` | Fired when elaboration finishes | `intent_slug`, `unit_count`, `has_wireframes` |
| `ai_dlc.unit.status_change` | Fired on any unit status transition | `intent_slug`, `unit_slug`, `old_status`, `new_status` |
| `ai_dlc.hat.transition` | Fired when the active hat changes | `intent_slug`, `from_hat`, `to_hat` |
| `ai_dlc.hat.failure` | Fired when work is sent back to a previous hat via `/fail` | `intent_slug`, `unit_slug`, `from_hat`, `to_hat`, `reason` |
| `ai_dlc.bolt.iteration` | Fired when a bolt iteration advances | `intent_slug`, `unit_slug`, `bolt_number`, `outcome` |
| `ai_dlc.review.decision` | Fired when the reviewer hat makes a decision | `intent_slug`, `unit_slug`, `decision`, `issue_count` |
| `ai_dlc.quality_gate.result` | Fired after each quality gate (test/lint/typecheck) | `intent_slug`, `unit_slug`, `gate`, `passed` |
| `ai_dlc.integrate.result` | Fired after integration validation | `intent_slug`, `passed`, `issue_count` |
| `ai_dlc.delivery.review` | Fired after pre-delivery code review | `intent_slug`, `decision`, `issue_count` |
| `ai_dlc.delivery.created` | Fired when a PR/MR is created | `intent_slug`, `strategy`, `pr_url` |
| `ai_dlc.followup.created` | Fired when a follow-up intent is created | `intent_slug`, `unit_slug` |
| `ai_dlc.cleanup.run` | Fired when worktree cleanup runs | `orphaned_count`, `merged_count` |
| `ai_dlc.worktree.event` | Fired on worktree create/delete | `event`, `worktree_path` |

### Example Queries

Once telemetry is flowing to your observability backend, common questions become straightforward:

- **Average bolts per unit** — Group `ai_dlc.bolt.iteration` by `unit_slug`, count per group
- **Review rejection rate** — Count `ai_dlc.review.decision` where `decision=rejected` vs. total
- **Most-failing quality gates** — Count `ai_dlc.quality_gate.result` where `passed=false`, group by `gate`
- **Cycle time per intent** — Time between `ai_dlc.intent.created` and `ai_dlc.intent.completed`
- **Hat failure hotspots** — Count `ai_dlc.hat.failure` grouped by `from_hat` and `to_hat`

## Next Steps

- **[Operations Guide](/docs/operations-guide/)** — Walkthrough of the operations phase
- **[Operation File Reference](/docs/operation-schema/)** — Schema reference for operation spec files
