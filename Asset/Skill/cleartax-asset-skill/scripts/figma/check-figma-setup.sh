#!/bin/bash
# Checks the 4 one-time, per-machine/per-account prerequisites for the
# "direct build in Figma via use_figma" workflow documented in
# the cleartax-asset-skill SKILL.md. Run this before starting a new asset build on
# any system — it tells you exactly which manual step (if any) is still
# outstanding, rather than failing partway through a build.

PLUGIN_NAME="Cleartax Font Swap"
PASS="✅"; FAIL="❌"; WARN="⚠️ "

echo "== 1. Inter Tight / Google Sans installed system-wide =="
FONT_COUNT=$(system_profiler SPFontsDataType 2>/dev/null | grep -ci "inter tight\|google sans")
if [ "$FONT_COUNT" -gt 0 ]; then
  echo "$PASS Found $FONT_COUNT registered Inter Tight / Google Sans font entries."
else
  echo "$FAIL No Inter Tight / Google Sans fonts registered on this system."
  echo "   Fix: install the TTF/OTF files from 'Design system/Fonts/Typography/Inter_Tight'"
  echo "        and '.../Google_Sans' in the Cleartax project folder (double-click each ->"
  echo "        Install Font, or copy into ~/Library/Fonts/). This skill's assets/fonts/"
  echo "        folders hold woff2 only, which macOS can't install."
fi
echo

echo "== 2. macOS Accessibility permission (Terminal + claude CLI) =="
ACCESS_CHECK=$(osascript -e 'tell application "System Events" to name of first process whose frontmost is true' 2>&1)
if echo "$ACCESS_CHECK" | grep -qi "not allowed assistive access"; then
  echo "$FAIL Accessibility permission not granted."
  CLAUDE_BIN=$(ps -o pid=,ppid=,comm= -p $$ | awk '{print $3}')
  pid=$$
  for i in 1 2 3 4 5 6; do
    info=$(ps -o pid=,ppid=,comm= -p $pid 2>/dev/null)
    [ -z "$info" ] && break
    comm=$(echo "$info" | awk '{print $3}')
    case "$comm" in */claude) CLAUDE_BIN="$comm" ;; esac
    pid=$(echo "$info" | awk '{print $2}')
  done
  echo "   Fix: this first attempt should have opened System Settings -> Privacy & Security ->"
  echo "        Accessibility on its own. If it did, toggle ON both of these in that list"
  echo "        (opening the dialog is not the same as the permission being granted):"
  echo "          - Terminal (or whichever terminal app is running this)"
  echo "          - claude   (the CLI binary itself: $CLAUDE_BIN)"
  echo "        If the dialog did NOT open, go there manually and click '+' to add the"
  echo "        claude binary at the path above."
else
  echo "$PASS Accessibility permission is granted (osascript can query System Events)."
fi
echo

echo "== 3. Figma Desktop running + font-swap plugin imported =="
if ! pgrep -x "Figma" >/dev/null 2>&1; then
  echo "$WARN Figma desktop app isn't running — can't check plugin import status."
  echo "   Open Figma desktop with the target file, then re-run this check."
else
  PLUGIN_LIST=$(osascript -e "tell application \"System Events\" to tell process \"Figma\" to get name of every menu item of menu 1 of menu item \"Development\" of menu 1 of menu bar item \"Plugins\" of menu bar 1" 2>&1)
  if echo "$PLUGIN_LIST" | grep -qi "not allowed assistive access"; then
    echo "$FAIL Can't check — Accessibility permission missing (see step 2 above)."
  elif echo "$PLUGIN_LIST" | grep -q "$PLUGIN_NAME"; then
    echo "$PASS \"$PLUGIN_NAME\" is imported and ready to run."
  else
    echo "$FAIL \"$PLUGIN_NAME\" not found in Plugins > Development."
    echo "   Fix (one-time, in Figma desktop): Plugins -> Development -> Import plugin from manifest…"
    echo "        -> select <skill>/scripts/figma/font-swap-plugin/intertight-googlesans/manifest.json"
  fi
fi
echo

echo "== 4. Correct Figma account connected (manual check) =="
echo "$WARN Can't check from a shell script — this needs the Figma MCP tool."
echo "   Ask Claude to call the Figma 'whoami' tool and confirm the email/team match"
echo "   what this asset should be built under. If wrong, reconnect the Figma"
echo "   connector via Claude's connected-apps/integrations settings."
