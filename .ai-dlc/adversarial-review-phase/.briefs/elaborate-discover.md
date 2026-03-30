---
intent_slug: adversarial-review-phase
worktree_path: /Volumes/dev/src/github.com/thebushidocollective/ai-dlc/.ai-dlc/worktrees/adversarial-review-phase
project_maturity: established
provider_config: {"spec":null,"ticketing":null,"design":null,"comms":null,"vcsHosting":"github","ciCd":"github-actions"}
---

# Intent Description

Add a new Phase 7.5 to the AI-DLC elaboration workflow: an adversarial review that runs after the existing Phase 7 (Spec Review). This phase uses a dedicated subagent to perform a full adversarial review of the intent and all unit specs — challenging assumptions, finding contradictions between units, stress-testing dependency ordering, probing for hidden complexity, checking spec completeness, and validating scope/YAGNI.

The subagent writes findings to a brief file. High-confidence fixes are applied automatically by the orchestrator. Low-confidence issues are presented to the user as follow-up questions.

Each finding includes a concrete suggested fix. The review identifies + suggests fixes.

## Clarification Answers

1. **Review Focus**: Full adversarial — challenges assumptions, finds contradictions between units, stress-tests dependency ordering, probes for hidden complexity, plus spec completeness and scope/YAGNI checks.
2. **Placement**: After Phase 7 (Spec Review) as Phase 7.5.
3. **Mechanism**: Dedicated subagent (like discovery) — writes findings to a brief, orchestrator presents results.
4. **Gate Behavior**: Mixed — high-confidence fixes applied automatically, low-confidence issues prompt user for clarification.
5. **Review Power**: Identify + suggest fixes — each finding includes a concrete suggestion.

## Discovery File Path

/Volumes/dev/src/github.com/thebushidocollective/ai-dlc/.ai-dlc/worktrees/adversarial-review-phase/.ai-dlc/adversarial-review-phase/discovery.md
