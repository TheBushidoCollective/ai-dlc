#!/bin/bash
# subagent-hook.sh - PreToolUse hook for Task|Skill
#
# Combines two responsibilities:
# 1. Context injection via han hook wrap-subagent-context (wraps prompt with AI-DLC context)
# 2. Permission mode injection (ensures subagents inherit parent's permission mode)
#
# The permission_mode field from the hook payload is injected into the Task tool's
# updatedInput, ensuring subagents run with the same permission level as the parent session.

set -e

# Read hook payload once
PAYLOAD=$(cat)

# Extract tool name - only inject mode for Task/Agent, not Skill
TOOL_NAME=$(echo "$PAYLOAD" | han parse json tool_name -r --default "" 2>/dev/null || echo "")

# Run the standard context wrapper
CONTEXT_RESULT=$(echo "$PAYLOAD" | han hook wrap-subagent-context --context-command "bash \"${CLAUDE_PLUGIN_ROOT}/hooks/subagent-context.sh\"" 2>/dev/null || echo "")

# Skip mode injection for Skill calls
if [ "$TOOL_NAME" = "Skill" ]; then
  [ -n "$CONTEXT_RESULT" ] && echo "$CONTEXT_RESULT"
  exit 0
fi

# Extract permission_mode from hook payload
PERMISSION_MODE=$(echo "$PAYLOAD" | han parse json permission_mode -r --default "" 2>/dev/null || echo "")

# If no permission mode to inject, pass through context result
if [ -z "$PERMISSION_MODE" ]; then
  [ -n "$CONTEXT_RESULT" ] && echo "$CONTEXT_RESULT"
  exit 0
fi

# If context wrapping produced output, inject mode into its updatedInput
if [ -n "$CONTEXT_RESULT" ]; then
  echo "$CONTEXT_RESULT" | jq --arg mode "$PERMISSION_MODE" \
    '.hookSpecificOutput.updatedInput.mode = $mode'
  exit 0
fi

# No context to wrap, but still inject mode into the original tool_input
TOOL_INPUT=$(echo "$PAYLOAD" | han parse json tool_input 2>/dev/null || echo "{}")
echo "$TOOL_INPUT" | jq --arg mode "$PERMISSION_MODE" \
  '. + {mode: $mode}' | jq '{hookSpecificOutput: {hookEventName: "PreToolUse", updatedInput: .}}'
