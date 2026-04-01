#!/usr/bin/env bash
# ensure-deps.sh — SessionStart hook that ensures jq and yq are installed.
# Outputs instructions for the agent to install missing dependencies.
set -euo pipefail

missing=()

command -v jq  >/dev/null 2>&1 || missing+=(jq)
command -v yq  >/dev/null 2>&1 || missing+=(yq)

if [ ${#missing[@]} -eq 0 ]; then
  exit 0
fi

# Detect package manager
if command -v brew >/dev/null 2>&1; then
  installer="brew install ${missing[*]}"
elif command -v apt-get >/dev/null 2>&1; then
  installer="sudo apt-get update && sudo apt-get install -y ${missing[*]}"
elif command -v apk >/dev/null 2>&1; then
  installer="apk add ${missing[*]}"
else
  installer="(no supported package manager found — install manually: ${missing[*]})"
fi

cat <<EOF
<must-act reason="missing required CLI tools">
The following required tools are missing: ${missing[*]}

Install them now by running:
  ${installer}

Do NOT proceed with any AI-DLC workflow until these are installed.
</must-act>
EOF
