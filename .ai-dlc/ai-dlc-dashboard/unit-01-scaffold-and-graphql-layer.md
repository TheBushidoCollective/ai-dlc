---
status: pending
depends_on: []
branch: ai-dlc/ai-dlc-dashboard/01-scaffold-and-graphql-layer
discipline: frontend
---

# unit-01-scaffold-and-graphql-layer

## Description

Set up the `/dashboard` workspace with Next.js 15, React 19, Tailwind CSS 4, and a GraphQL client. Define TypeScript types matching the Han coordinator schema, create reusable query hooks, and establish the project scaffold (layout, routing, theme support).

## Discipline

frontend - This unit will be executed by `do-frontend-development` specialized agents.

## Success Criteria

- [ ] `/dashboard` workspace created with Next.js 15, React 19, Tailwind CSS 4
- [ ] Root `package.json` updated to include `dashboard` in workspaces
- [ ] GraphQL client configured to connect to `localhost:41957/graphql`
- [ ] TypeScript types defined for Session, HookExecution, Metric, PluginMetric
- [ ] Reusable React hooks for fetching sessions, hook executions, and metrics
- [ ] App layout with navigation shell and theme toggle (dark/light)
- [ ] Biome configuration extended to cover the new workspace
- [ ] `bun install` and `bun run build` succeed for the dashboard

## Notes

- Use `urql` or `graphql-request` for the GraphQL client (lightweight, fits Next.js well)
- Mirror the existing website's Tailwind and Biome setup for consistency
- The app shell should have a sidebar for session list and a main content area
