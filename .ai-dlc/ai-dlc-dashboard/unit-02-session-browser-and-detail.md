---
status: pending
depends_on: [unit-01-scaffold-and-graphql-layer]
branch: ai-dlc/ai-dlc-dashboard/02-session-browser-and-detail
discipline: frontend
---

# unit-02-session-browser-and-detail

## Description

Build the session browser (list view) and session detail page. The browser lists all sessions from the GraphQL API with status badges, timestamps, and filtering. Clicking a session navigates to a detail view showing all hook executions in chronological order with their inputs/outputs.

## Discipline

frontend - This unit will be executed by `do-frontend-development` specialized agents.

## Success Criteria

- [ ] Session list page at `/` showing all sessions from GraphQL
- [ ] Each session card shows: name, status badge, start/end time, metadata preview
- [ ] Sessions are filterable by status (RUNNING, COMPLETED, FAILED, etc.)
- [ ] Session detail page at `/session/[id]` showing full session info
- [ ] Hook executions listed chronologically with name, status, duration, input/output
- [ ] Expandable hook execution cards to view full input/output JSON
- [ ] Empty states for no sessions and no hook executions
- [ ] Loading and error states handled gracefully

## Notes

- Status badges should use color coding: green=COMPLETED, blue=RUNNING, red=FAILED, etc.
- Consider virtualized list for sessions with many hook executions
- Hook execution input/output are JSON strings — parse and render with syntax highlighting
