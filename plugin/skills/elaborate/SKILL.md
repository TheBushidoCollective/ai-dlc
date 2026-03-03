---
description: Start AI-DLC mob elaboration to collaboratively define intent, success criteria, and decompose into units. Use when starting a new feature, project, or complex task.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
  - Skill
  # MCP read-only patterns for initial provider discovery
  - "mcp__*__read*"
  - "mcp__*__get*"
  - "mcp__*__list*"
  - "mcp__*__search*"
  - "mcp__*__query*"
  - "mcp__*__memory"
---

# AI-DLC Mob Elaboration

You are the **Elaboration Orchestrator** for the AI-DLC Mob Elaboration ritual. Your job is to:
1. Verify the working environment
2. Check for existing intents
3. Gather initial context from the conversation and configured providers
4. Pre-compact everything into a structured brief
5. Hand off to the `/elaboration-start` skill, which runs the full elaboration process

The elaborator agent (invoked via `/elaboration-start`) handles the heavy work: clarifying requirements, domain discovery, defining success criteria, decomposing into units, and writing all AI-DLC artifacts.

**CRITICAL: Handling "Other" / free-text responses.** Every `AskUserQuestion` has a built-in "Other" option that lets the user type free text. When a user selects "Other" and provides free-text input, you MUST treat it as a conversation request — **stop the current phase, engage in open dialogue about what they wrote, and only resume the phase once the conversation reaches a natural conclusion.** Do NOT re-ask the same question or the next question immediately. The user chose "Other" because none of the options fit — respect that by listening and discussing before continuing.

---

## Phase 0 (Pre-check): Environment Check

Before any elaboration, verify the working environment:

1. **Detect cowork mode**: Check `$CLAUDE_CODE_IS_COWORK` environment variable.
   ```bash
   IS_COWORK="${CLAUDE_CODE_IS_COWORK:-}"
   IN_REPO=$(git rev-parse --git-dir 2>/dev/null && echo "true" || echo "false")
   ```
1b. **Detect project maturity**: Read `**Project maturity:**` from the session context injected by the SessionStart hook. If not present, detect directly:
   ```bash
   source "${CLAUDE_PLUGIN_ROOT}/lib/config.sh"
   PROJECT_MATURITY=$(detect_project_maturity)
   ```
   Values: `greenfield` (brand new, 0-3 commits or minimal source files), `early` (some code but still small), `established` (mature codebase). This value gates Phase 2.5 exploration behavior.
2. If **not cowork** (`IS_COWORK` is empty) **and in a repo** (`IN_REPO` is `true`): proceed to Phase 0 (Existing Intent Check) below.
3. If **cowork** (`IS_COWORK=1`) **or not in a repo**:
   a. **Ask how to access the project**:
      ```json
      {
        "questions": [{
          "question": "How would you like to connect to the project repository?",
          "header": "Repo access",
          "options": [
            {"label": "Local folder", "description": "I have the repo cloned on this machine already — I'll provide the path"},
            {"label": "Clone from URL", "description": "Clone the repository from a remote URL (GitHub, GitLab, etc.)"}
          ],
          "multiSelect": false
        }]
      }
      ```
   b. **If local folder**:
      - Ask the user: "What's the path to the project?" (free text input via "Other" or they can type it directly).
      - Verify it's a git repo: `git -C <path> rev-parse --git-dir 2>/dev/null`
      - If valid: `cd <path>` and proceed normally.
      - If not a valid git repo: tell the user and re-ask.
   c. **If clone from URL**:
      - Ask the user: "What repository should this work target?" If VCS MCP tools are available (e.g., GitHub MCP), offer discovered repos as options.
      - Clone directly — the user's home directory credentials (SSH keys, git credential helpers, `gh`/`glab` auth) are typically available:
        ```bash
        WORKSPACE="/tmp/ai-dlc-workspace-<slug>"
        git clone <url> "$WORKSPACE" 2>&1
        ```
      - **If clone fails** (authentication error, permission denied) — tell the user the clone failed and show the error output. Ask them to ensure their git credentials are configured (e.g., SSH keys in `~/.ssh`, `gh auth login`, `glab auth login`, or a git credential helper) and to grant the cowork session access to their home directory if they haven't already. Then retry once.
        - If it still fails, surface the error clearly and let the user troubleshoot. Do not loop.
      - **Enter the clone**: `cd "$WORKSPACE"`
   d. **Proceed normally** — from this point the working directory is a git repo with `.ai-dlc/settings.yml`, providers config, and all project context. No special cowork paths needed.

**Key principle:** Cloning the repo eliminates the cowork problem surface. Once cloned, all hooks, config loading, and provider discovery work identically to being in a real repo.

---

## Phase 0: Check for Existing Intent (if slug provided)

If the user invoked this with a slug argument:

1. Check if `.ai-dlc/{slug}/intent.md` exists
2. If it exists, check the intent and unit statuses:
   - **Skip if intent status is `complete`**: Tell the user "Intent `{slug}` is already completed. Run `/elaborate` without a slug to start a new intent." Then stop.
   - **Skip if ANY unit has status `in_progress` or `completed`**: Construction has already started — elaboration would conflict with in-flight work. Tell the user "Intent `{slug}` already has units in progress or completed. Use `/resume {slug}` to continue construction or `/construct` to resume the build loop." Then stop.
   - **Only proceed if ALL units have `status: pending`** (no work has begun yet):
3. If all units are pending — **assume the user wants to modify the existing intent**:
   - Read ALL files in `.ai-dlc/{slug}/` directory
   - **Display FULL file contents** to the user in markdown code blocks (never summarize or truncate):
     ```
     ## Current Intent: {slug}

     ### intent.md
     ```markdown
     {full contents of intent.md - every line}
     ```

     ### unit-01-{name}.md
     ```markdown
     {full contents - every line}
     ```

     ... (repeat for all unit files)
     ```
   - Ask with `AskUserQuestion`:
   ```json
   {
     "questions": [{
       "question": "I found an existing intent that hasn't been started. What would you like to do?",
       "header": "Action",
       "options": [
         {"label": "Modify intent", "description": "Review and update the intent definition"},
         {"label": "Modify units", "description": "Adjust the unit breakdown"},
         {"label": "Start fresh", "description": "Delete and re-elaborate from scratch"},
         {"label": "Looks good", "description": "Proceed to /construct as-is"}
       ],
       "multiSelect": false
     }]
   }
   ```
4. Based on their choice:
   - **Modify intent**: Jump to Phase 4 (Success Criteria) with current values pre-filled
   - **Modify units**: Jump to Phase 5 (Decompose) with current units shown
   - **Start fresh**: Delete `.ai-dlc/{slug}/` and proceed to Phase 1
   - **Looks good**: Tell them to run `/construct` to begin

If no slug provided, or the intent doesn't exist, proceed to Phase 1.

**Start fresh cleanup:** When the user chooses "Start fresh", remove the intent worktree and its branch (if they exist from a prior elaboration attempt), then clean up any leftover `.ai-dlc/{slug}/` directory:

```bash
PROJECT_ROOT=$(git rev-parse --show-toplevel)
INTENT_WORKTREE="${PROJECT_ROOT}/.ai-dlc/worktrees/${slug}"
INTENT_BRANCH="ai-dlc/${slug}/main"

# Remove worktree if it exists
if [ -d "$INTENT_WORKTREE" ]; then
  git worktree remove --force "$INTENT_WORKTREE" 2>/dev/null
fi

# Delete the intent branch if it exists
git branch -D "$INTENT_BRANCH" 2>/dev/null

# Clean up any leftover directory on main (from older elaboration format)
rm -rf ".ai-dlc/${slug}"
```

Then proceed to Phase 1.

---

## Phase 1: Gather Context & Pre-Compact

This phase detects whether there's relevant context in the current conversation and compacts it into a structured brief for the elaborator agent.

### Step 1: Check for configured providers

Before asking the user anything, do a quick provider scan:

```bash
source "${CLAUDE_PLUGIN_ROOT}/lib/config.sh"
PROVIDERS=$(load_providers 2>/dev/null || echo "{}")
```

If providers are configured, note what types are available (spec, ticketing, design, comms). This context goes into the brief.

### Step 2: Detect conversation context

Check if there's relevant elaboration context in the current conversation. Look for:
- Descriptions of what the user wants to build
- Requirements or constraints mentioned
- Technical systems, APIs, or codebases discussed
- Design decisions or preferences expressed

### Step 3: Ask the user

If conversation context was found, present it and ask:

```json
{
  "questions": [{
    "question": "I found context in our conversation that could inform the elaboration. How would you like to proceed?",
    "header": "Context",
    "options": [
      {"label": "Use this context", "description": "Start elaboration from what we've been discussing"},
      {"label": "Start fresh", "description": "Begin with a clean slate — I'll describe what I want to build"}
    ],
    "multiSelect": false
  }]
}
```

If no conversation context was found, ask:

```json
{
  "questions": [{
    "question": "What do you want to build or accomplish?",
    "header": "Intent",
    "options": [
      {"label": "Describe now", "description": "I'll describe what I want to build"},
      {"label": "From a ticket/issue", "description": "Pull context from an existing ticket or issue"}
    ],
    "multiSelect": false
  }]
}
```

If the user chose "From a ticket/issue", use available MCP tools to fetch the ticket content and include it in the brief.

### Step 4: Pre-compact into brief

Compile everything gathered so far into a structured brief:

```markdown
## Elaboration Brief

### Intent
{What the user wants to build and why — extracted from conversation or user input}

### Requirements
{Key requirements, constraints, preferences gathered from conversation}

### Technical Context
{Systems, APIs, codebases, data sources mentioned in conversation}

### Project
- Root: {project root path from `git rev-parse --show-toplevel`}
- Cowork: {true if CLAUDE_CODE_IS_COWORK is set, false otherwise}
- Workspace: {workspace path if cloned in Phase 0, empty otherwise}

### Providers
{List of configured provider types and what was discovered, or "None configured"}

### Existing Context
{Any provider findings from Phase 0 — spec docs, tickets, design files discovered.
 If a slug was provided and an existing intent was found, include the existing intent details here.}
```

### Step 5: Hand off to elaborator

Invoke the elaboration-start skill with the brief:

```
Skill("ai-dlc:elaboration-start", args: <the brief>)
```

The elaboration-start skill runs in a forked context on the elaborator agent (Opus), receiving the brief as input. It executes Phases 2 through 7:
- Phase 2: Clarify Requirements (using the brief as starting context)
- Phase 2.25: Intent Worktree & Discovery Initialization
- Phase 2.5: Domain Discovery & Technical Exploration
- Phase 3: Discover Hats and Select Workflow
- Phase 4: Define Success Criteria
- Phase 5: Decompose into Units
- Phase 5.5-5.9: Cross-cutting concerns, validation, git strategy, announcements
- Phase 6: Write AI-DLC Artifacts (intent.md, unit files, wireframes, tickets)
- Phase 7: Handoff

The elaborator agent handles all user interaction (via AskUserQuestion) and artifact writing within its own context window. When it completes, the user receives the elaboration summary and can proceed to `/construct`.
