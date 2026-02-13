---
status: pending
depends_on: [unit-02-session-browser-and-detail]
branch: ai-dlc/ai-dlc-dashboard/04-live-monitoring
discipline: frontend
---

# unit-04-live-monitoring

## Description

Add real-time monitoring capability for active (RUNNING) sessions. The dashboard should poll for new hook executions and update the session detail view and timeline automatically. Active sessions should be visually distinguished in the session list.

## Discipline

frontend - This unit will be executed by `do-frontend-development` specialized agents.

## Success Criteria

- [ ] Active sessions (status=RUNNING) are visually distinguished in the session list (e.g., pulsing indicator)
- [ ] Session detail view polls for new hook executions at a configurable interval (default 2s)
- [ ] New events appear in the hook execution list and timeline without full page refresh
- [ ] Timeline extends automatically as new events arrive
- [ ] "Follow mode" toggle: when enabled, auto-scrolls to latest event as they arrive
- [ ] Polling pauses when session status changes to COMPLETED/FAILED/CANCELLED
- [ ] Network error handling: shows indicator when polling fails, retries with backoff

## Notes

- Use `setInterval` with cleanup or React Query's `refetchInterval` for polling
- The GraphQL endpoint doesn't support subscriptions, so polling is the approach
- Consider optimistic updates — show new events immediately when detected
- Follow mode should be enabled by default for live sessions, disabled when user scrubs
