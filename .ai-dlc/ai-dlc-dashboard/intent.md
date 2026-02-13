---
workflow: default
mode: OHOTL
testing:
  unit_tests: true
  integration_tests: true
  coverage_threshold: 80
  e2e_tests: true
created: 2026-02-10T20:17:00-07:00
status: active
---

# AI-DLC Dashboard

## Problem

The AI-DLC process generates rich telemetry through Han's coordinator GraphQL endpoint — sessions, hook executions, metrics, and hat transitions — but there's no way to visualize or replay this data. Users can't see what happened during an AI-DLC run, understand the flow between hats, or monitor active sessions in real time.

## Solution

Build a standalone Next.js dashboard app (new workspace in the monorepo at `/dashboard`) that connects to the Han coordinator GraphQL API at `localhost:41957/graphql`. The dashboard provides:

1. **Session browser** — list all sessions with status, timestamps, and filtering
2. **Session detail** — chronological view of hook executions and metrics for a session
3. **Timeline scrub** — video-player-style timeline for scrubbing through events
4. **Live monitoring** — auto-updating view for in-progress sessions
5. **Hat workflow visualization** — visual representation of hat transitions within the AI-DLC workflow

## Success Criteria

- [ ] Dashboard app runs as a standalone workspace in the monorepo (`/dashboard`)
- [ ] Connects to Han coordinator GraphQL at `localhost:41957/graphql`
- [ ] Lists all sessions with status, timestamps, and metadata
- [ ] Displays hook executions for a selected session in chronological order
- [ ] Timeline scrub UI allows scrubbing through events like a video timeline
- [ ] Live mode: auto-updates when new hook executions arrive for active sessions
- [ ] Replay mode: step through completed sessions with play/pause/scrub controls
- [ ] Visualizes hat transitions within the AI-DLC workflow (which hat was active when)
- [ ] Built with Next.js + React (consistent with existing website tech stack)
- [ ] All existing project tests/lint pass

## Context

- Han coordinator runs on port 41957, exposes GraphQL at `/graphql`
- GraphQL schema includes: Sessions, HookExecutions, PluginMetrics, Metrics
- Sessions have statuses: PENDING, RUNNING, PAUSED, COMPLETED, FAILED, CANCELLED
- The existing website uses Next.js 15, React 19, Tailwind CSS 4, Framer Motion
- The monorepo uses Bun as package manager and Biome for linting/formatting
- Hat data comes from hook execution metadata (which hat was active during each execution)
