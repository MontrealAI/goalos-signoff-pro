#!/usr/bin/env bash
set -euo pipefail
ROOT=${1:-.}
cp -R . "$ROOT"/
echo "Installed GoalOS Signoff Pro v32 package into $ROOT"
echo "Run: node scripts/build-goalos-signoff-pro-institutional-v22-v32.mjs"
