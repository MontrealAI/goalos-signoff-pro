#!/usr/bin/env bash
set -euo pipefail
ROOT="$(pwd)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
rsync -a "$SCRIPT_DIR/" "$ROOT/"
node scripts/build-goalos-signoff-pro-institutional-v22-v31.mjs
node scripts/verify-executive-ai-proof-console-v31.mjs
printf '\nGoalOS Signoff Pro v31 installed locally. Review, commit, and deploy.\n'
