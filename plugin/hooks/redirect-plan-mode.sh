#!/bin/bash
# redirect-plan-mode.sh - PreToolUse hook for EnterPlanMode
#
# Intercepts Claude Code's built-in EnterPlanMode tool and redirects users
# to use AI-DLC's /elaborate workflow instead.
#
# AI-DLC's elaborate → construct flow is a more comprehensive planning process
# that replaces the need for Claude Code's generic plan mode.

set -e

# Read stdin to get PreToolUse payload
HOOK_INPUT=$(cat)

# Extract tool name
TOOL_NAME=$(echo "$HOOK_INPUT" | han parse json tool_name -r 2>/dev/null || echo "")

# Only intercept EnterPlanMode
if [ "$TOOL_NAME" != "EnterPlanMode" ]; then
  exit 0
fi

# Output JSON response to deny the tool and provide guidance
# Using the standard Claude Code PreToolUse hook output format
cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "AI-DLC: Use /elaborate instead of plan mode.\n\nThe AI-DLC plugin replaces Claude Code's built-in plan mode with a more comprehensive workflow:\n\n**`/elaborate`** - Structured mob elaboration that:\n- Defines intent and success criteria collaboratively\n- Decomposes work into independent units\n- Selects appropriate workflow (default, tdd, hypothesis, adversarial)\n- Creates isolated worktrees for safe iteration\n- Sets up the construction loop with quality gates\n\n**To start:** Run `/elaborate` with a description of what you want to build.\n\nExample:\n```\n/elaborate Add user authentication with OAuth2 support\n```"
  }
}
EOF
