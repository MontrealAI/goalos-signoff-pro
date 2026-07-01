# PR: Add GoalOS Executive AI Proof Console v31

## Summary

This PR adds an incremental, additive v31 website experience upgrade for GoalOS Signoff Pro.

It preserves all existing pages and adds a guided, interactive, public-safe console for first-time visitors, executives, DAO delegates, auditors, investors, enterprises, and AI operators.

## Core message

> Blockchain proves the transaction. GoalOS proves the work.  
> No Proof. No Trust. No Settlement.

## What changed

- Added v31 Executive AI Proof Console routes.
- Added role-based synthetic proof scenarios.
- Added dynamic proof-gate visualization.
- Added v31 manifest and public-safe demo artifacts.
- Added homepage spotlight insertion via build script.
- Added floating guided-console affordance across pages.
- Added v22-v31 build/verify scripts.
- Updated Pages workflow to prefer v31 when available.

## Safety

The console has no forms, inputs, uploads, cookies, analytics, wallets, payments, personal/confidential data, or value movement.

## Validation

Run:

```bash
node scripts/build-goalos-signoff-pro-institutional-v22-v31.mjs
node scripts/verify-executive-ai-proof-console-v31.mjs
```
