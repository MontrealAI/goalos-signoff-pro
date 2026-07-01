#!/usr/bin/env bash
set -euo pipefail
node scripts/build-goalos-signoff-pro-institutional-v22-v30.mjs
node scripts/generate-proof-before-settlement-research-lab-bundle.mjs
node scripts/verify-proof-before-settlement-research-lab-page.mjs
node scripts/verify-goalos-signoff-public-labs-v22-v30.mjs
