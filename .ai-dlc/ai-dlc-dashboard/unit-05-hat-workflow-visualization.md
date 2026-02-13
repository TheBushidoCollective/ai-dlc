---
status: pending
depends_on: [unit-03-timeline-replay-engine]
branch: ai-dlc/ai-dlc-dashboard/05-hat-workflow-visualization
discipline: frontend
---

# unit-05-hat-workflow-visualization

## Description

Add a visual hat workflow diagram to the session detail view that shows the AI-DLC hat transitions. As the user scrubs through the timeline, the visualization highlights which hat was active at that point. The diagram shows the workflow sequence (e.g., elaborator -> planner -> builder -> reviewer) with iteration loops.

## Discipline

frontend - This unit will be executed by `do-frontend-development` specialized agents.

## Success Criteria

- [ ] Workflow diagram renders the hat sequence for the session's workflow type
- [ ] Each hat node shows the hat name and emoji from the hat definitions
- [ ] Active hat is highlighted based on the current timeline position
- [ ] Completed hats are visually distinguished from pending ones
- [ ] Iteration loops (reviewer -> builder retries) are visualized with loop indicators
- [ ] Hat transitions animate smoothly when scrubbing or during playback
- [ ] Clicking a hat in the diagram jumps the timeline to when that hat started
- [ ] Hat detail card appears on hover/click showing description and duration spent

## Notes

- Hat activity can be inferred from hook execution metadata and `han keep` state
- The existing website has a `WorkflowVisualizer` component that can serve as reference
- Use Framer Motion for transition animations
- Layout the workflow horizontally with arrow connections between hats
