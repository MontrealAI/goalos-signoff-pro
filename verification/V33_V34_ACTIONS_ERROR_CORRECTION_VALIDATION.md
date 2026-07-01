# Validation

Expected success after upload:

```text
GoalOS v33 Loop → RSI → ASI self-contained rebuild PASS
GoalOS v33 Loop → RSI → ASI verification PASS
GoalOS Signoff Pro public labs v22-v33 global gate PASS
```

The original failure was caused by relying on `site/loop-rsi-asi-superintelligence-lab.html` after the production builder regenerated `site/`. The corrected builder restores v33 from `docs/generated-source/v33/site/`.
