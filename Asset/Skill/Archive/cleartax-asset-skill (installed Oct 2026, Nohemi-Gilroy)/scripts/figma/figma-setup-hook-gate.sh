#!/bin/bash
# PreToolUse hook gate for the Figma MCP tools (see .claude/settings.local.json).
# Runs <skill>/scripts/figma/check-figma-setup.sh at most ONCE per Claude Code session
# (use_figma fires dozens of times per build; re-running the full check every
# time would be pure noise). Non-blocking: always exits 0 and never sets
# continue:false — the two things it can catch (Accessibility permission,
# Figma plugin import) require manual human action anyway, so blocking the
# tool call would just be disruptive without fixing anything.
#
# On first fire this session: if the check finds any failure, emit a
# systemMessage surfacing it. On a clean pass, or on every subsequent fire
# this session, stay completely silent.

INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MARKER="/tmp/.claude-figma-setup-checked-${SESSION_ID}"

if [ -f "$MARKER" ]; then
  exit 0
fi
touch "$MARKER"

CHECK_OUTPUT=$("$SCRIPT_DIR/check-figma-setup.sh" 2>&1)

if echo "$CHECK_OUTPUT" | grep -q "❌"; then
  FAILURES=$(echo "$CHECK_OUTPUT" | grep -B1 "❌" | grep "^==" | sed 's/^== *//; s/ *==$//')
  MSG="Figma setup check found issues (run <skill>/scripts/figma/check-figma-setup.sh for full details): ${FAILURES}"
  jq -n --arg msg "$MSG" '{systemMessage: $msg}'
fi

exit 0
