# GoalOS Signoff Hybrid Production — Final Validation Report

Generated: 2026-06-25T22:27:56.113059+00:00

## Package validation

```text
> goalos-signoff-hybrid-production@1.0.0 hybrid:verify
> npm run package:verify


> goalos-signoff-hybrid-production@1.0.0 package:verify
> npm run package:verify:commercial && npm run package:verify:hybrid


> goalos-signoff-hybrid-production@1.0.0 package:verify:commercial
> node scripts/verify-package.mjs

GoalOS Signoff commercial package verification PASS (15 required artifacts, schema bundle, JSON syntax, RLS, and secret-file boundary).

> goalos-signoff-hybrid-production@1.0.0 package:verify:hybrid
> node scripts/verify-hybrid-package.mjs

GoalOS Signoff hybrid package verification PASS
> goalos-signoff-hybrid-production@1.0.0 hybrid:anchor:check
> node scripts/check-anchor-config.mjs

{
  "status": "PASS",
  "mode": "disabled",
  "mainnet": false,
  "anchorContractConfigured": false,
  "relayerConfigured": false
}
GoalOS Signoff commercial package verification PASS (15 required artifacts, schema bundle, JSON syntax, RLS, and secret-file boundary).
```

## Dependency audit

Production dependency audit from `package-lock.json`:

```json
{
  "info": 0,
  "low": 0,
  "moderate": 0,
  "high": 0,
  "critical": 0,
  "total": 0
}
```

## Included product surfaces

- Mainstream SaaS Signoff workflow.
- Signed Mission Receipts.
- Supabase RLS database and storage setup.
- Optional Ethereum receipt-anchor contract and runbook.
- Optional IPFS/redacted metadata strategy.
- Web3 reference MVP package.
- AGIALPHA and 48-contract protocol integration roadmap.
- Fail-closed policy: Mainnet anchoring disabled by default; AGIALPHA and escrow disabled by default; user funds not authorized.

## Boundary

This is a production-grade private-beta package and launch system. The operator should run `npm ci && npm run check` in GitHub Actions or a clean deployment environment after upload. A complete dependency install/build was not claimed from this container because the local npm cache/tar extraction environment was unreliable during dependency installation.
