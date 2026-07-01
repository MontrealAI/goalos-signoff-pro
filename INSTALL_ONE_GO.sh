#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
cp -R .github "$ROOT"/
cp -R config "$ROOT"/
cp -R scripts "$ROOT"/
cp -R docs "$ROOT"/
cp -R verification "$ROOT"/
cp GOALOS_PUBLIC_LAB_V29_START_HERE.md "$ROOT"/
echo "Installed GoalOS Signoff Pro Blockchain Proof Mandate & Due Diligence Lab v29 into $ROOT"
echo "Next: git add . && git commit -m 'Add GoalOS Blockchain Proof Mandate Lab v29' && git push origin main"
