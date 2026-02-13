---
status: pending
depends_on: [unit-02-session-browser-and-detail]
branch: ai-dlc/ai-dlc-dashboard/03-timeline-replay-engine
discipline: frontend
---

# unit-03-timeline-replay-engine

## Description

Build the core timeline scrub and replay engine. This adds a video-player-style timeline bar to the session detail view. Users can scrub through events chronologically, play/pause auto-advancement, and control playback speed. The main content area updates to show the state at the current timeline position.

## Discipline

frontend - This unit will be executed by `do-frontend-development` specialized agents.

## Success Criteria

- [ ] Timeline bar rendered at the bottom of the session detail view
- [ ] Timeline shows markers for each hook execution positioned by timestamp
- [ ] Scrub handle can be dragged to any position on the timeline
- [ ] Play/pause button auto-advances through events at configurable speed (1x, 2x, 4x)
- [ ] Current position indicator shows timestamp and event index (e.g., "Event 3 of 12")
- [ ] Main content area scrolls to and highlights the hook execution at the current position
- [ ] Keyboard shortcuts: Space (play/pause), Left/Right arrows (step back/forward)
- [ ] Timeline is responsive and works on different screen widths

## Notes

- The timeline range spans from session startTime to endTime (or last event for active sessions)
- Events are positioned proportionally based on their timestamp within the range
- Consider using Framer Motion for smooth animations when scrubbing
- Playback should pause when the user interacts with the scrub handle
