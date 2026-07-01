#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
node scripts/build-goalos-signoff-public-labs-v22-v33.mjs
node scripts/verify-loop-rsi-asi-superintelligence-console-v33.mjs
printf '
GoalOS Loop → RSI → ASI Superintelligence Console Lab v33 installed and verified.
'
