#!/usr/bin/env bash
# Update & redeploy the PPE Violation Dashboard.
# Usage:  /opt/ppe-violation-dashboard/update.sh
set -euo pipefail

APP_DIR="/opt/ppe-violation-dashboard"
PM2_NAME="ppe-dashboard"

cd "$APP_DIR"

echo "==> [1/4] Pulling latest from GitHub..."
git pull --ff-only

echo "==> [2/4] Installing dependencies..."
npm ci

echo "==> [3/4] Building production bundle..."
npm run build

echo "==> [4/4] Restarting pm2 process ($PM2_NAME)..."
pm2 restart "$PM2_NAME" --update-env
pm2 save

echo ""
echo "==> Done. Dashboard updated and restarted."
pm2 status "$PM2_NAME"
