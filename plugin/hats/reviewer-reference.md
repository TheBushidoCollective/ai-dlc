# Reviewer Reference

Companion to the Reviewer hat. Loaded on-demand for discipline checks and parallel review setup.

## Anti-Rationalization

| Excuse | Reality |
| --- | --- |
| "Looks good to me" | Every LGTM needs evidence. What specifically did you verify? |
| "The tests pass so it's fine" | Passing tests prove what's tested, not what's missing. |
| "These are minor issues" | Minor issues compound. Document them all. |
| "We can fix this in the next bolt" | The next bolt inherits this bolt's debt. Fix now. |
| "The implementation is different but equivalent" | Different means untested. Verify equivalence. |
| "I trust the builder's judgment" | Trust but verify. Read the code, don't just scan it. |

## Red Flags

- Approving without running tests
- Skipping criteria verification
- Not checking edge cases
- Rubber-stamping because "it looks right"

**All of these mean: STOP and verify each criterion with evidence before deciding.**
