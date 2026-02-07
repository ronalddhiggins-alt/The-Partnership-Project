#!/bin/bash

# 1. Kill any existing node processes (Zombies)
echo "Stopping all Narrative Auditor processes..."
pkill -f "node" || true

# 2. Wait a moment
sleep 2

# 3. Start Backend (Server)
echo "Starting Backend Server..."
# Using nohup to ensure it stays running even if the shell closes
nohup node narrative_auditor/server/index.js > narrative_auditor_server.log 2>&1 &

# 4. Start Frontend (Client)
echo "Starting Frontend Client..."
nohup npm run dev --prefix narrative_auditor > narrative_auditor_client.log 2>&1 &

echo "✅ Restart Complete! The application is booting up..."
