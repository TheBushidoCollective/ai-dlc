---
category: ticketing
description: Default ticketing provider behavior for AI-DLC
---

# Ticketing Provider — Default Instructions

## Ticket Creation (Elaboration Phase)
- **Epic handling**:
  - If `epic` is already set in intent.md frontmatter (provided by product), link all tickets to that existing epic — do NOT create a new one
  - If `epic` is empty, create one **epic** per intent (title from intent, description from Problem + Solution) and store the key in intent.md frontmatter: `epic: PROJ-123`
- Create one **ticket** per unit linked to the epic
- Map unit `depends_on` to ticket **blocked-by** relationships:
  - If unit-02 depends on unit-01, the ticket for unit-02 is blocked by unit-01's ticket
- Store ticket key in unit frontmatter: `ticket: PROJ-124`

## Status Sync (During Execution)
- **Builder starts unit** → Move ticket to In Progress
- **Unit passes review** → Move ticket to Done
- **Unit blocked** → Flag ticket as Blocked, add blocker description as comment
- **Reviewer rejects** → Add review feedback as ticket comment, keep In Progress

## Ticket Content
- Include unit success criteria as a checklist in the ticket description
- Link to the `.ai-dlc/` artifact path or branch for developer reference
