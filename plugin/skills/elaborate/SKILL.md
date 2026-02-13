---
description: Start AI-DLC mob elaboration to collaboratively define intent, success criteria, and decompose into units. Use when starting a new feature, project, or complex task.
disable-model-invocation: true
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
  - Task
  - WebSearch
  - WebFetch
  - AskUserQuestion
  - ToolSearch
  - ListMcpResourcesTool
  - ReadMcpResourceTool
  # MCP read-only tool patterns (no create/update/delete/send/push/execute)
  - "mcp__*__read*"
  - "mcp__*__get*"
  - "mcp__*__list*"
  - "mcp__*__search*"
  - "mcp__*__query*"
  - "mcp__*__ask*"
  - "mcp__*__resolve*"
  - "mcp__*__fetch*"
  - "mcp__*__lookup*"
  - "mcp__*__analyze*"
  - "mcp__*__describe*"
  - "mcp__*__explain*"
  - "mcp__*__memory"
  # Ticketing provider write tools (epic/ticket creation during elaboration)
  - "mcp__*__create*issue*"
  - "mcp__*__create*ticket*"
  - "mcp__*__create*epic*"
---

# AI-DLC Mob Elaboration

You are the **Elaborator** starting the AI-DLC Mob Elaboration ritual. Your job is to collaboratively define:
1. The **Intent** - What are we building and why?
2. **Domain Model** - What entities, data sources, and systems are involved?
3. **Success Criteria** - How do we know when it's done?
4. **Units** - Independent pieces of work (for complex intents), each with enough technical detail that a builder with zero prior context builds the right thing

Then you'll write these as files in `.ai-dlc/{intent-slug}/` for the construction phase.

**CRITICAL PRINCIPLE: Elaboration is not a quick phase.** The purpose of elaboration is to build such deep understanding of the domain that the resulting spec is unambiguous. If a builder could misinterpret a unit and build the wrong thing, the elaboration is not done. Do NOT close this phase until you have a clear, specific, technically-grounded spec validated by the user.

---

## Phase 0 (Pre-check): Environment Discovery

Before any elaboration, verify the working environment:

1. Check if we're in a git repo: `git rev-parse --git-dir`
2. If yes → proceed to Phase 0 (Existing Intent Check) below
3. If no → enter **cowork discovery flow**:
   a. Use `ListMcpResourcesTool` to scan available MCP servers for VCS providers (GitHub, GitLab, etc.)
   b. Use `AskUserQuestion` to ask: "What repo should this work target?" (include options from VCS MCP if available)
   c. Clone the repo: `git clone <repo-url> /tmp/ai-dlc-workspace-{slug}/`
   d. `cd` to the cloned repo — all subsequent phases work normally
   e. Discover providers from available MCP tools:
      - Match MCP server names against known types (jira, notion, figma, slack, etc.)
      - Ask user to confirm inferred providers and fill gaps
      - Save confirmed providers: `han keep save providers.json '<json>'`

---

## Phase 0: Check for Existing Intent (if slug provided)

If the user invoked this with a slug argument:

1. Check if `.ai-dlc/{slug}/intent.md` exists
2. If it exists and no units are completed (all units have `status: pending`):
   - **Assume the user wants to modify the existing intent**
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
3. Based on their choice:
   - **Modify intent**: Jump to Phase 4 (Success Criteria) with current values pre-filled
   - **Modify units**: Jump to Phase 5 (Decompose) with current units shown
   - **Start fresh**: Delete `.ai-dlc/{slug}/` and proceed to Phase 1
   - **Looks good**: Tell them to run `/construct` to begin

If no slug provided, or the intent doesn't exist, proceed to Phase 1.

---

## Phase 1: Gather Intent

Ask the user: "What do you want to build or accomplish?"

Wait for their answer. Do not explain the process.

Before asking clarification questions, check for configured providers:
- If a spec provider (Notion, Confluence) is configured, search for related specs/documents using read-only MCP tools
- If a ticketing provider (Jira, Linear) is configured, search for related tickets/epics
- If a design provider (Figma) is configured, search for related design files
Use discovered context to inform your clarification questions in Phase 2.

---

## Phase 2: Clarify Requirements

Use `AskUserQuestion` to explore the user's intent. Ask 2-4 questions at a time, each with 2-4 options.

CRITICAL: Do NOT list questions as plain text. Always use the `AskUserQuestion` tool.

Focus your questions on understanding:
- What **specific problem** this solves (not just "build X" but "build X because Y")
- Who uses it and how (the user journey, not just "it's for developers")
- What **systems, APIs, data sources, or codebases** are involved
- Key constraints or non-obvious requirements
- What the user cares about most (what would make them say "this isn't what I wanted"?)

**Do NOT ask generic checkbox questions** like "What's the scope?" or "What's the complexity?" These produce shallow understanding. Instead, ask questions specific to what the user described. If they said "build a dashboard for X", ask about what X's domain model looks like, what data they expect to see, what the key user workflows are.

Continue asking until you can articulate back to the user, in your own words, exactly what they want built. If you can't explain the domain entities, data flows, and user experience in concrete detail, you don't understand it yet.

---

## Phase 2.5: Domain Discovery & Technical Exploration

**This phase is mandatory.** Before defining success criteria or decomposing into units, you MUST deeply understand the technical landscape. Shallow understanding here causes builders to build the wrong thing.

### What to Explore

Based on what the user described in Phase 2, identify every relevant technical surface and explore it thoroughly. Use ALL available research tools — codebase exploration, API introspection, web searches, and documentation fetching:

1. **APIs and Schemas**: If the intent involves an API, query it. Run introspection queries. Read the actual schema. Map every type, field, query, mutation, and subscription. Don't guess what data is available — verify it.

2. **Existing Codebases**: If the intent builds on or integrates with existing code, read it. Use `Glob` and `Grep` to find relevant files. Read source code, not just file names. Understand existing patterns, conventions, and architecture.

3. **Data Sources**: If the intent involves data, understand where it lives. Query for real sample data. Understand what fields are populated, what's empty, what's missing. Identify gaps between what's available and what's needed.

4. **Domain Model**: From your exploration, build a domain model — the key entities, their relationships, and their lifecycle. This is not a database schema; it's a conceptual map of the problem space.

5. **Existing Implementations**: If there are related features, similar tools, or reference implementations, read them. Understand what already exists so you don't build duplicates or miss integration points.

6. **External Documentation and Libraries**: Use `WebSearch` and `WebFetch` to research relevant libraries, frameworks, APIs, standards, or prior art. If the intent involves a third-party system, find its documentation and understand its capabilities. If the intent involves a design pattern or technique, research best practices and common pitfalls.

7. **Configured Providers**: If providers are configured in `.ai-dlc/settings.yml` or discovered via MCP:
   - **Spec providers** (Notion, Confluence, Google Docs): Search for requirements docs, PRDs, or technical specs related to the intent
   - **Ticketing providers** (Jira, Linear): Search for existing tickets, epics, or stories that relate to or duplicate this work
   - **Design providers** (Figma): Search for design files, component libraries, or mockups relevant to UI work
   - **Comms providers** (Slack, Teams): Search for relevant discussions or decisions in channels
   Use `ToolSearch` to discover available MCP tools matching provider types, then use read-only MCP tools for research.

### How to Explore

Use every research tool available. Spawn multiple explorations in parallel for independent concerns:

1. **Subagents for deep codebase/API exploration**: Use `Task` with `subagent_type: "Explore"` for multi-step research that requires reading many files, querying APIs, and synthesizing findings:

```
Task({
  description: "Explore {specific system}",
  subagent_type: "Explore",
  prompt: "I need to deeply understand {system}. Read source code, query APIs, map the data model. Report back with: every entity and its fields, every query/endpoint available, sample data showing what's actually populated, and any gaps or limitations discovered."
})
```

2. **MCP tools for domain knowledge**: Use `ToolSearch` to discover available MCP tools, then use read-only MCP tools for domain research. Examples:
   - Repository documentation (DeepWiki): `mcp__*__read_wiki*`, `mcp__*__ask_question`
   - Library docs (Context7): `mcp__*__resolve*`, `mcp__*__query*`
   - Project memory (han): `mcp__*__memory`
   - Any other MCP servers available in the environment
   - Provider MCP tools: If providers are configured, use their MCP tools for research (e.g., `mcp__*jira*__search*` for Jira tickets, `mcp__*notion*__search*` for Notion pages)

3. **Web research for external context**: Use `WebSearch` for library docs, design patterns, API references, prior art. Use `WebFetch` to read specific documentation pages.

4. **Direct exploration**: Use `Read`, `Glob`, `Grep`, and `Bash` (for curl, CLI tools, introspection queries) directly when you know what you're looking for.

**Spawn multiple research paths in parallel.** Don't serialize explorations that are independent — launch all of them at once and synthesize when results return.

If a VCS MCP is available (e.g., GitHub MCP), use it for code browsing alongside or instead of local `Glob`/`Grep`. This enables research from the orchestrator even before a repo is fully cloned in cowork mode.

### Communicate Findings as You Go

**Do not disappear into research and come back with a wall of text.** The user is your collaborator, not a reviewer. As you explore:

- **Share what you're finding** in real-time. When a research subagent returns results, summarize the key findings to the user before launching the next exploration. Let them see your understanding forming.
- **Surface surprises and ambiguities immediately.** If something doesn't match what the user described, or if you discover a gap or limitation, tell the user right away. Don't wait until the domain model presentation.
- **Ask clarifying questions when discoveries raise new questions.** If you find that an API has 23 queries but you're not sure which ones are relevant, ask. If you find two possible data sources for the same information, ask which one to use.
- **Check your mental model incrementally.** Don't wait until the end to validate everything at once. After each major finding, briefly confirm: "I found X — does that match your understanding?" This catches misunderstandings early.

The goal is a **conversation**, not a research report. The user has domain knowledge you don't have. They can correct your understanding in seconds if you surface it, but they can't fix what they can't see.

**CRITICAL**: Do not summarize or skip this phase. The exploration results directly determine whether the spec is accurate. If you explore a GraphQL API, report every type. If you read source code, report the actual architecture, not your guess about it.

### Present Domain Model to User

After exploration, present your findings to the user as a **Domain Model**:

```markdown
## Domain Model

### Entities
- **{Entity1}**: {description} — Fields: {field1}, {field2}, ...
- **{Entity2}**: {description} — Fields: ...

### Relationships
- {Entity1} has many {Entity2}
- {Entity2} belongs to {Entity3}

### Data Sources
- **{Source1}** ({type: GraphQL API / REST API / filesystem / etc.}):
  - Available: {what data can be queried}
  - Missing: {what data is NOT available from this source}
  - Real sample: {abbreviated real data showing what's populated}

### Data Gaps
- {description of any gap between what's needed and what's available}
- {proposed solution for each gap}
```

Use `AskUserQuestion` to validate:
```json
{
  "questions": [{
    "question": "Does this domain model accurately capture the system? Are there entities, relationships, or data sources I'm missing?",
    "header": "Domain Model",
    "options": [
      {"label": "Looks accurate", "description": "The domain model captures the system correctly"},
      {"label": "Missing entities", "description": "There are important entities or relationships not listed"},
      {"label": "Wrong relationships", "description": "Some relationships are incorrect"},
      {"label": "Missing data sources", "description": "There are data sources I haven't discovered"}
    ],
    "multiSelect": true
  }]
}
```

**Do NOT proceed past this phase until the user confirms the domain model is accurate.** If they identify gaps, explore more. This is the foundation everything else builds on.

---

## Phase 3: Discover Hats and Select Workflow

### Step 1: Discover Available Hats

Use `han parse yaml` to read all available hat definitions dynamically:

```bash
# List all hats from plugin directory
for hat_file in "${CLAUDE_PLUGIN_ROOT}/hats/"*.md; do
  [ -f "$hat_file" ] || continue
  slug=$(basename "$hat_file" .md)
  name=$(han parse yaml name -r < "$hat_file" 2>/dev/null)
  desc=$(han parse yaml description -r < "$hat_file" 2>/dev/null)
  echo "- **${name:-$slug}** (\`$slug\`): $desc"
done

# Also check for project-local hat overrides
for hat_file in .ai-dlc/hats/*.md; do
  [ -f "$hat_file" ] || continue
  slug=$(basename "$hat_file" .md)
  name=$(han parse yaml name -r < "$hat_file" 2>/dev/null)
  desc=$(han parse yaml description -r < "$hat_file" 2>/dev/null)
  echo "- **${name:-$slug}** (\`$slug\`): $desc [project override]"
done
```

Display the available hats to the user so they can see what's available for workflow composition.

### Step 2: Discover Available Workflows

Read workflows from plugin defaults and project overrides:

```bash
# Plugin workflows (defaults)
cat "${CLAUDE_PLUGIN_ROOT}/workflows.yml"

# Project workflow overrides (if any)
[ -f ".ai-dlc/workflows.yml" ] && cat ".ai-dlc/workflows.yml"
```

### Step 3: Select or Compose Workflow

Based on the intent, recommend a workflow from the discovered options. Present available workflows dynamically — do NOT hardcode the options.

Use `AskUserQuestion` with the discovered workflows as options. Include a "Custom" option that lets the user compose their own hat sequence from the available hats:

```json
{
  "questions": [{
    "question": "Which workflow fits this task? (or compose a custom one from available hats)",
    "header": "Workflow",
    "options": [
      {"label": "{recommended} (Recommended)", "description": "{hats as arrows}"},
      {"label": "{workflow2}", "description": "{hats as arrows}"},
      {"label": "{workflow3}", "description": "{hats as arrows}"},
      {"label": "Custom", "description": "Compose a custom hat sequence from available hats"}
    ],
    "multiSelect": false
  }]
}
```

If the user selects "Custom", ask them to specify which hats to include and in what order.

---

## Phase 3.5: Select Operating Mode

The operating mode defines the level of human oversight for this intent. This applies to the **entire intent**, not individual hats.

Use `AskUserQuestion`:
```json
{
  "questions": [{
    "question": "What level of human oversight for this intent?",
    "header": "Mode",
    "options": [
      {"label": "OHOTL (Recommended)", "description": "AI edits files freely without asking. You see changes in real-time and can interrupt at any point. Best for most development work."},
      {"label": "HITL", "description": "AI proposes each change as a plan and waits for your approval before editing any file. You approve or reject each step. Best for novel or high-risk work."},
      {"label": "AHOTL", "description": "AI runs with full autonomy — no permission prompts, no pauses. You review the final result. Best for well-defined, low-risk tasks with clear success criteria."}
    ],
    "multiSelect": false
  }]
}
```

**Mode mapping for Agent Teams (when `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is enabled):**

| AI-DLC Mode | Agent Teams `mode` | Behavior |
|-------------|-------------------|----------|
| HITL | `plan` | Agent proposes, human approves each step |
| OHOTL | `acceptEdits` | Agent works autonomously, human can intervene |
| AHOTL | `bypassPermissions` | Agent operates with full autonomy |

---

## Phase 4: Define Success Criteria

Work with the user to define 3-7 **verifiable** success criteria. Each MUST be:
- **Specific** - Unambiguous
- **Measurable** - Programmatically verifiable
- **Testable** - Can write a test for it

Good:
```
- [ ] API endpoint returns 200 with valid auth token
- [ ] Invalid tokens return 401 with error message
- [ ] Rate limit of 100 requests/minute is enforced
- [ ] All existing tests pass
```

Bad:
```
- [ ] Code is clean
- [ ] API works well
```

Use `AskUserQuestion` to confirm criteria:
```json
{
  "questions": [{
    "question": "Here are the success criteria I've captured. Are these complete?",
    "header": "Criteria",
    "options": [
      {"label": "Yes, looks good", "description": "Proceed with these criteria"},
      {"label": "Need to add more", "description": "I have additional criteria"},
      {"label": "Need to revise", "description": "Some criteria need adjustment"}
    ],
    "multiSelect": false
  }]
}
```

---

## Phase 5: Decompose into Units (if complex)

For medium/complex intents, decompose into **Units** - independent pieces of work.

Ask with `AskUserQuestion`:
```json
{
  "questions": [{
    "question": "Should we decompose this into parallel units?",
    "header": "Decompose",
    "options": [
      {"label": "Yes (Recommended)", "description": "Break into 2-5 independent units with detailed specs"},
      {"label": "No", "description": "Keep as single unit of work"}
    ],
    "multiSelect": false
  }]
}
```

If yes, define each unit with **enough detail that a builder with zero prior context builds the right thing**:

- **Name and description**: What this unit accomplishes, stated in terms of the domain model
- **Domain entities**: Which entities from the domain model this unit deals with
- **Data sources**: Which APIs, queries, or data files this unit reads from or writes to. Reference specific query names, endpoint paths, or file patterns discovered during Domain Discovery.
- **Technical specification**: Specific components, views, functions, or modules to create. If it's a UI, describe what the user sees and interacts with. If it's an API, describe the endpoints and their behavior. If it's a data layer, describe the transformations.
- **Success criteria**: Specific, testable criteria that reference domain entities (not generic criteria like "displays data")
- **Dependencies on other units**: What must be built first and why
- **What this unit is NOT**: Explicit boundaries to prevent scope creep. If another unit handles related concerns, say so.

**Bad unit description** (too vague, builder will guess wrong):
```
## unit-02: Session Browser
Build the session browser page showing sessions from GraphQL.
```

**Good unit description** (builder knows exactly what to build):
```
## unit-02: Intent Browser and DAG View
Display all AI-DLC Intents (read from `.ai-dlc/*/intent.md` files) as cards showing:
- Intent title, status (from frontmatter), workflow type, operating mode
- Unit count and completion progress (N of M units completed)
- Created date and last activity

Clicking an intent navigates to the Intent Detail view which shows:
- The unit dependency DAG as a visual graph (units as nodes, depends_on as edges)
- Each unit node shows: name, status, current hat, discipline, retry count
- Color coding: pending=gray, in_progress=blue, completed=green, blocked=red

Data sources:
- Intent metadata: Read `.ai-dlc/{slug}/intent.md` frontmatter via filesystem API
- Unit metadata: Read `.ai-dlc/{slug}/unit-*.md` frontmatter
- Live state: Query `han keep load iteration.json` for current hat and unitStates

This unit does NOT handle: hat visualization (unit-03), live monitoring (unit-04),
or timeline replay (unit-05). It only renders the structural hierarchy.
```

Present the full unit breakdown to the user and confirm before proceeding.

---

## Phase 5.5: Define Testing Requirements

Ask the user about testing expectations for this intent:

```json
{
  "questions": [
    {
      "question": "What testing requirements should we enforce for this intent?",
      "header": "Unit Tests",
      "options": [
        {"label": "Required", "description": "New code must have unit tests"},
        {"label": "Not required", "description": "Unit tests are optional"}
      ],
      "multiSelect": false
    },
    {
      "question": "Integration tests?",
      "header": "Integration Tests",
      "options": [
        {"label": "Required", "description": "Integration tests must verify component interactions"},
        {"label": "Not required", "description": "Integration tests are optional"}
      ],
      "multiSelect": false
    },
    {
      "question": "Coverage threshold?",
      "header": "Coverage",
      "options": [
        {"label": "80%", "description": "Minimum 80% code coverage"},
        {"label": "70%", "description": "Minimum 70% code coverage"},
        {"label": "60%", "description": "Minimum 60% code coverage"},
        {"label": "None", "description": "No coverage requirement"}
      ],
      "multiSelect": false
    },
    {
      "question": "End-to-end tests?",
      "header": "E2E Tests",
      "options": [
        {"label": "Required", "description": "E2E tests must pass"},
        {"label": "Not required", "description": "E2E tests are optional"}
      ],
      "multiSelect": false
    }
  ]
}
```

Store the testing configuration for the reviewer hat to enforce.

---

## Phase 5.75: Spec Validation Gate

**This is the quality gate that prevents shallow specs from reaching construction.**

Before writing any artifacts, present the **complete elaboration summary** to the user:

```markdown
## Elaboration Summary

### Intent
{1-2 sentence problem statement}

### Domain Model
{Key entities and their relationships — abbreviated from Phase 2.5}

### Data Sources
{List each data source with what it provides}

### Units
For each unit:
- **unit-NN-{slug}**: {one-line description}
  - Entities: {which domain entities}
  - Data: {which data sources/queries}
  - Builds: {specific components/modules/endpoints}
  - Criteria: {count} success criteria

### Testing Requirements
{Summary of testing config}

### Workflow & Mode
{workflow name} — {mode}
```

Then ask with `AskUserQuestion`:
```json
{
  "questions": [{
    "question": "Is this spec detailed enough that a developer with NO prior context about this domain could build the right thing? (If a builder could misinterpret any unit and build something wrong, answer 'Not detailed enough')",
    "header": "Spec Quality",
    "options": [
      {"label": "Yes, detailed enough", "description": "Every unit is unambiguous — proceed to write artifacts"},
      {"label": "Not detailed enough", "description": "Some units are vague or could be misinterpreted — need more detail"},
      {"label": "Wrong direction", "description": "The overall approach needs rethinking"}
    ],
    "multiSelect": false
  }]
}
```

- **"Yes, detailed enough"**: Proceed to Phase 6
- **"Not detailed enough"**: Ask which units need more detail, then return to Phase 5 for those units. Do NOT proceed until every unit is unambiguous.
- **"Wrong direction"**: Discuss with user, potentially return to Phase 2 or 2.5

**Do NOT skip this gate.** This is the single most important quality check in the entire elaboration process. A vague spec produces wrong implementations. A precise spec produces correct ones.

---

## Phase 5.8: Git Strategy

Ask about the branching and merge strategy for this intent. These settings control how unit work is organized and merged.

Use `AskUserQuestion`:
```json
{
  "questions": [
    {
      "question": "How should unit work be branched?",
      "header": "Branching",
      "options": [
        {"label": "Unit branches (Recommended)", "description": "One branch per unit, merged to intent branch on completion. Best for parallel work with clear boundaries."},
        {"label": "Intent branch", "description": "One long-lived intent branch, all work happens there. Best for tightly coupled units."},
        {"label": "Trunk-based", "description": "All work on main, no feature branches. Best for small, low-risk changes."},
        {"label": "Bolt", "description": "One branch per intent with squashed commits. Best for clean history."}
      ],
      "multiSelect": false
    },
    {
      "question": "Should unit branches auto-merge to the intent branch when approved?",
      "header": "Auto-merge",
      "options": [
        {"label": "Yes (Recommended)", "description": "Automatically merge unit branches to intent branch when reviewer approves. Keeps intent branch up to date."},
        {"label": "No", "description": "Manual merge — you decide when to merge unit branches. More control, more manual work."}
      ],
      "multiSelect": false
    }
  ]
}
```

Store the selections. These will be written into the `intent.md` frontmatter in Phase 6 under a `git:` key:

```yaml
git:
  change_strategy: unit    # or intent, trunk, bolt
  auto_merge: true         # or false
  auto_squash: false       # default false
```

Map user selections to config values:
- "Unit branches" → `unit`
- "Intent branch" → `intent`
- "Trunk-based" → `trunk`
- "Bolt" → `bolt`
- "Yes" auto-merge → `true`
- "No" auto-merge → `false`

---

## Phase 6: Write AI-DLC Artifacts

Create the intent branch and worktree, then write files in `.ai-dlc/{intent-slug}/`:

### 1. Create intent branch and worktree

**CRITICAL: The intent MUST run in an isolated worktree, not the main working directory. Create this BEFORE writing any artifacts so all files are committed to the intent branch.**

```bash
INTENT_BRANCH="ai-dlc/${intentSlug}"
INTENT_WORKTREE="/tmp/ai-dlc-${intentSlug}"
git worktree add -B "$INTENT_BRANCH" "$INTENT_WORKTREE"
cd "$INTENT_WORKTREE"
```

This ensures:
- Main working directory stays on `main` for other work
- All artifacts are written directly on the intent branch
- All subsequent `han keep` operations use the intent branch's storage
- Multiple intents can run in parallel in separate worktrees
- Clean separation between main and AI-DLC orchestration state
- Subagents spawn from the intent worktree, not the original repo

**Tell the user the worktree location** so they know where to find it.

### 2. Write `intent.md`:
```markdown
---
workflow: {workflow-name}
mode: {HITL|OHOTL|AHOTL}
git:
  change_strategy: {unit|intent|trunk|bolt}
  auto_merge: {true|false}
  auto_squash: false
testing:
  unit_tests: true          # true = required, false = optional
  integration_tests: false  # true = required, false = optional
  coverage_threshold: 80    # percentage (0-100), or null for no requirement
  e2e_tests: false          # true = required, false = optional
created: {ISO date}
status: active
epic: ""  # Ticketing provider epic key (auto-populated if ticketing provider configured)
---

# {Intent Title}

## Problem
{What problem are we solving? Be specific about the pain point.}

## Solution
{High-level approach — enough detail to understand the architecture, not just a one-liner.}

## Domain Model
{Key entities, their relationships, and lifecycle. This is the conceptual foundation
that all units build on. Every builder should read this section to understand the
problem space.}

### Entities
- **{Entity1}**: {description} — Key fields: {fields}
- **{Entity2}**: {description} — Key fields: {fields}

### Relationships
- {How entities relate to each other}

### Data Sources
- **{Source1}** ({type}): {what it provides, endpoint/path, any auth needed}
- **{Source2}** ({type}): {what it provides}

### Data Gaps
- {Any gaps between what's needed and what's available, with proposed solutions}

## Success Criteria
- [ ] Criterion 1 {referencing specific domain entities}
- [ ] Criterion 2
- [ ] Criterion 3

## Context
{Relevant background, constraints, decisions made during elaboration}
```

**Testing frontmatter schema:**

| Field | Type | Description |
|-------|------|-------------|
| `testing.unit_tests` | boolean | Whether unit tests are required for new code |
| `testing.integration_tests` | boolean | Whether integration tests are required |
| `testing.coverage_threshold` | number or null | Minimum coverage percentage, or null if no requirement |
| `testing.e2e_tests` | boolean | Whether E2E tests must pass |

### 3. Write `unit-NN-{slug}.md` for each unit:
```markdown
---
status: pending
depends_on: []
branch: ai-dlc/{intent-slug}/NN-{slug}
discipline: {discipline}  # frontend, backend, api, documentation, devops, etc.
ticket: ""  # Ticketing provider ticket key (auto-populated if ticketing provider configured)
---

# unit-NN-{slug}

## Description
{What this unit accomplishes, in terms of domain entities}

## Discipline
{discipline} - This unit will be executed by `do-{discipline}` specialized agents.

## Domain Entities
{Which entities from the domain model this unit works with, and how}

## Data Sources
{Specific APIs, queries, endpoints, or files this unit reads/writes. Reference actual
query names, field paths, or file patterns discovered during Domain Discovery.}

## Technical Specification
{Specific components, views, modules, or endpoints to create. Describe what the user
sees/interacts with (for UI), or what the API accepts/returns (for backend), or what
transformations occur (for data layers). Be concrete enough that a builder cannot
misinterpret what to build.}

## Success Criteria
- [ ] {Criterion referencing specific domain entities, not generic}
- [ ] {Another criterion}

## Boundaries
{What this unit does NOT handle. Reference which other units own related concerns.}

## Notes
{Implementation hints, context, pitfalls to avoid}
```

**Discipline determines which specialized agents execute the unit:**
- `frontend` → `do-frontend-development` agents
- `backend` → backend-focused agents
- `api` → API development agents
- `documentation` → `do-technical-documentation` agents
- `devops` → infrastructure/deployment agents

### 4. Save iteration state to han keep:

Intent-level state is saved to the current branch (which is now the intent branch):

```bash
# Intent-level state -> current branch (intent branch)
han keep save intent-slug "{intent-slug}"

# Intent-level state -> current branch (intent branch)
han keep save iteration.json '{"iteration":1,"hat":"{first-hat-after-elaborator}","workflowName":"{workflow}","mode":"{HITL|OHOTL|AHOTL}","workflow":["{hat1}","{hat2}"],"status":"active"}'
```

### 5. Commit all artifacts on intent branch:

```bash
git add .ai-dlc/
git commit -m "elaborate: define intent and units for ${intentSlug}"
```

### 5b. Push artifacts to remote (cowork)

If the orchestrator is in a temporary workspace (`/tmp/ai-dlc-workspace-*`):

```bash
git push -u origin "$INTENT_BRANCH"
```

This ensures builders can pull the intent branch when working remotely. Note in the handoff: "Artifacts pushed to `ai-dlc/{intent-slug}` branch on remote."

---

## Phase 6.5: Sync to Ticketing Provider

If a ticketing provider is configured and MCP tools are available:

1. **Create epic** for the intent:
   - Title: Intent title from intent.md
   - Description: Problem + Solution sections
   - Use MCP tool matching `mcp__*__create*epic*` or `mcp__*__create*issue*`
   - Store returned key in intent.md frontmatter as `epic: "PROJ-123"`

2. **Create ticket per unit** linked to the epic:
   - Title: Unit name and one-line description
   - Description: Unit's description, success criteria, and technical specification
   - Link to the epic created above
   - Use MCP tool matching `mcp__*__create*ticket*` or `mcp__*__create*issue*`
   - Store returned key in unit frontmatter as `ticket: "PROJ-124"`

3. If MCP tools for ticketing are not available, skip and note:
   "Ticketing provider configured but MCP tools not available. Create tickets manually."

4. Commit updated frontmatter:
   ```bash
   git add .ai-dlc/
   git commit -m "elaborate: sync tickets for ${intentSlug}"
   ```

---

## Phase 7: Handoff to Construction

Tell the user:

```
Elaboration complete!

Intent Worktree: /tmp/ai-dlc-{intent-slug}/
Branch: ai-dlc/{intent-slug}

Created: .ai-dlc/{intent-slug}/
- intent.md (intent, config, and testing requirements)
- unit-01-{name}.md
- unit-02-{name}.md
...

Workflow: {workflowName}
Mode: {mode}
Next hat: {next-hat}

To start the autonomous build loop:
  /construct

The construction phase will iterate through each unit, using quality gates
(tests, types, lint) as backpressure until all success criteria are met.

Note: All AI-DLC work happens in the worktree at /tmp/ai-dlc-{intent-slug}/
Your main working directory stays clean on the main branch.
```
