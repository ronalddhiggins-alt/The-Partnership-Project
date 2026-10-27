#!/usr/bin/env bash
# Double-click launcher for Sovereign Desktop Studio
if [ -f "$(dirname "$0")/server.py" ]; then
  cd "$(dirname "$0")"
elif [ -d "$HOME/Documents/AI_Partnership_Book/3_SOFTWARE_STUDIO/sovereign_desktop_studio" ]; then
  cd "$HOME/Documents/AI_Partnership_Book/3_SOFTWARE_STUDIO/sovereign_desktop_studio"
fi
echo "Starting Sovereign Desktop Studio..."
python3 server.py

