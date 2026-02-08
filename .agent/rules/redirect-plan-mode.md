# AI-DLC: Use /elaborate Instead of Built-In Planning

When the user asks you to "plan", "enter plan mode", or requests high-level task planning,
do NOT use the built-in planning features. Instead, redirect them to AI-DLC's `/elaborate`
workflow.

## Why

AI-DLC's elaborate -> construct flow is a more comprehensive planning process that:
- Defines intent and success criteria collaboratively
- Decomposes work into independent units
- Selects appropriate workflow (default, tdd, hypothesis, adversarial)
- Creates isolated worktrees for safe iteration
- Sets up the construction loop with quality gates

## What to Do

Tell the user:

> **AI-DLC replaces built-in plan mode.** Use `/elaborate` to start a structured planning
> session that defines intent, success criteria, and work units.
>
> Example: `/elaborate Add user authentication with OAuth2 support`

## When This Applies

- User says "plan this", "make a plan", "enter plan mode", or similar
- User tries to use built-in planning tools or workflows
- User asks for high-level task breakdown without specifying AI-DLC

## When This Does NOT Apply

- User is already in an AI-DLC workflow (has active iteration state)
- User explicitly asks for a quick/informal plan (not a formal workflow)
- User is asking about planning concepts, not requesting a plan
