---
description: Configure AI-DLC for this project — auto-detects VCS, hosting, CI/CD, and MCP providers. Creates or updates .ai-dlc/settings.yml.
disable-model-invocation: true
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
  - ToolSearch
  - ListMcpResourcesTool
  - ReadMcpResourceTool
  # MCP read-only tool patterns (discovery only, no writes)
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
---

# AI-DLC Setup

You are the **Setup Assistant** for AI-DLC. Your job is to configure this project's `.ai-dlc/settings.yml` by auto-detecting the environment and confirming settings with the user.

This skill is **idempotent** — re-running `/setup` preserves existing settings as defaults.

---

## Phase 0: Load Existing Settings

1. Check if `.ai-dlc/settings.yml` exists using the `Read` tool.
   - If it exists, parse the current values — these become the **defaults** for all prompts below.
   - If `.ai-dlc/` doesn't exist, create it:
     ```bash
     mkdir -p .ai-dlc
     ```

2. Store the existing settings (or empty `{}`) as `EXISTING_SETTINGS` for reference throughout.

---

## Phase 1: Auto-Detect Environment

Run these detections via Bash by sourcing the config library:

```bash
source "${CLAUDE_PLUGIN_ROOT}/lib/config.sh"

VCS=$(detect_vcs)
VCS_HOSTING=$(detect_vcs_hosting)
CI_CD=$(detect_ci_cd)
DEFAULT_BRANCH=$(resolve_default_branch "auto")

echo "vcs=$VCS"
echo "vcs_hosting=$VCS_HOSTING"
echo "ci_cd=$CI_CD"
echo "default_branch=$DEFAULT_BRANCH"
```

Store results:
- `DETECTED_VCS`: `git` or `jj`
- `DETECTED_HOSTING`: `github`, `gitlab`, `bitbucket`, or empty
- `DETECTED_CI_CD`: `github-actions`, `gitlab-ci`, `jenkins`, `circleci`, or empty
- `DETECTED_DEFAULT_BRANCH`: resolved branch name

---

## Phase 2: Probe MCP Tools for Providers

Use `ToolSearch` to discover available MCP providers. Run **all probes in parallel**:

| Category | Search Terms |
|----------|-------------|
| Ticketing | `"jira"`, `"linear"`, `"gitlab issues"` |
| Spec | `"notion"`, `"confluence"`, `"google docs"` |
| Design | `"figma"` |
| Comms | `"slack"`, `"teams"`, `"discord"` |

Also check:
- If `DETECTED_HOSTING` is `github` and `gh` CLI exists (`command -v gh`), suggest `github-issues` as a zero-config ticketing option
- Use `ListMcpResourcesTool` as a secondary signal for available MCP servers

Build a detection results map:

| Category | Detected Provider | Source |
|----------|------------------|--------|
| Ticketing | e.g., `jira` | MCP tool found: `mcp__*jira*` |
| Spec | e.g., `confluence` | MCP tool found: `mcp__*confluence*` |
| Design | e.g., `figma` | MCP tool found: `mcp__*figma*` |
| Comms | e.g., `slack` | MCP tool found: `mcp__*slack*` |

If existing settings already declare a provider for a category, keep that as the default even if detection found something different.

---

## Phase 3: Present Findings & Confirm

Display a summary table of all detected settings:

```
## Detected Configuration

| Setting | Value | Source |
|---------|-------|--------|
| VCS | git | auto-detected |
| Hosting | github | auto-detected |
| CI/CD | github-actions | auto-detected |
| Default Branch | main | auto-detected |
| Ticketing | jira | MCP tools found |
| Spec | confluence | MCP tools found |
| Design | — | not detected |
| Comms | slack | MCP tools found |
```

If existing settings differ from detection, show both:

```
| Ticketing | jira | existing settings (detected: linear) |
```

Then ask a **single confirmation question**:

Use `AskUserQuestion`:
- "Are these detected settings correct?"
- Options: "Yes, looks good" / "Need to adjust"

If **"Need to adjust"** → ask follow-up questions for each category they want to change. Use `AskUserQuestion` with the valid enum values from the settings schema for each provider type.

---

## Phase 4: Provider-Specific Configuration

For each **confirmed provider**, collect required configuration:

### Jira
- **Required**: Project key (e.g., `PROJ`)
- If Jira MCP tools are available, try to list accessible projects to offer as options:
  - Use `mcp__*__getVisibleJiraProjects` or similar tool if found via ToolSearch
  - Present discovered projects as `AskUserQuestion` options
- If no MCP tool available for listing, ask as free-text via `AskUserQuestion`

### GitHub Issues
- **Zero config** — no additional settings needed. Just confirm the provider type.

### Linear
- Project/workspace identifier if needed — ask via `AskUserQuestion`

### GitLab Issues
- Project identifier if needed — ask via `AskUserQuestion`

### Confluence
- Space key — ask via `AskUserQuestion`
- If Confluence MCP tools available, try to list spaces as options

### Notion
- Workspace ID — ask via `AskUserQuestion`

### Figma
- No required config beyond confirming the provider type

### Slack / Teams / Discord
- Channel or workspace identifiers if needed — ask via `AskUserQuestion`

**Skip** any provider the user declined or that wasn't detected and the user didn't manually add.

Pre-fill all values from existing `settings.yml` if re-running.

---

## Phase 5: VCS Strategy

Ask the user about their preferred change strategy and auto-merge behavior.

Use `AskUserQuestion`:

**Question 1: Change strategy**
- "How should AI-DLC organize code changes?"
- Options:
  - **Unit branches (Recommended)** — One branch per unit of work, merged individually
  - **Intent branch** — One long-lived branch per intent with linear history
  - **Trunk** — All work on main branch, no feature branches
  - **Bolt** — One branch per intent with squashed commits

Pre-fill from existing `settings.yml` `{vcs}.change_strategy` if available.

**Question 2: Auto-merge**
- "Should completed unit branches be automatically merged?"
- Options:
  - **Yes (Recommended)** — Auto-merge when unit passes review
  - **No** — Manual merge after review

Pre-fill from existing `settings.yml` `{vcs}.auto_merge` if available.

Only ask auto-merge if strategy is `unit` or `bolt` (the strategies that use branches to merge).

---

## Phase 6: Write Settings File

1. Read existing `.ai-dlc/settings.yml` via `Read` tool (if it exists) to preserve any manual edits or fields not covered by this wizard.

2. Merge new values over existing. Build the YAML structure:

```yaml
# Only include the detected VCS section (git or jj, not both)
git:  # or jj:
  change_strategy: unit
  default_branch: main
  auto_merge: true
  elaboration_review: true

# Only include providers that were confirmed
providers:
  ticketing:
    type: jira
    config:
      project_key: PROJ
  spec:
    type: confluence
    config:
      space_key: TEAM
  comms:
    type: slack
```

Rules:
- Only include `git:` or `jj:` — not both — based on `DETECTED_VCS`
- Only include provider sections for providers the user confirmed
- Preserve any `instructions:` fields from existing settings
- Preserve any fields not covered by this wizard (e.g., custom `config` keys)
- Output must validate against `plugin/schemas/settings.schema.json`

3. Write the file using the `Write` tool to `.ai-dlc/settings.yml`.

---

## Phase 7: Confirmation

Display a final summary:

```
## Setup Complete

| Setting | Value |
|---------|-------|
| VCS | git |
| Default Branch | main |
| Change Strategy | unit |
| Auto-merge | yes |
| Ticketing | jira (PROJ) |
| Spec | confluence (TEAM) |
| Design | — |
| Comms | slack |

Settings written to `.ai-dlc/settings.yml`.

Next: Run `/elaborate` to start your first intent.
```
