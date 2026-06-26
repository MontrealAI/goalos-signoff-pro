# GoalOS Signoff Pro v1.1

**Know when AI work is actually done.**

GoalOS Signoff Pro is a mainstream SaaS workflow for defining deliverables, collecting evidence, requesting changes, recording human acceptance, and issuing signed Mission Receipts. It is designed for AI consultants, agencies, software contractors, research teams, grant programs, and internal AI pilot teams.

This repository is the standalone product repository for **GoalOS Signoff Pro v1.1**.

## What this product does

1. A client defines what “done” means.
2. A builder submits work and evidence.
3. GoalOS performs mechanical completeness checks.
4. A reviewer requests changes or recommends acceptance.
5. The client makes the final decision.
6. GoalOS issues a signed Mission Receipt.
7. Optionally, a receipt hash can later be anchored with IPFS/Ethereum verification.

## What this product does not do yet

This version intentionally does **not** provide escrow, custody, AGIALPHA staking, automatic settlement, Mainnet payment release, or legal/compliance approval. The blockchain path is limited to optional receipt verification and should be piloted on Sepolia first.

## MontrealAI repository setup

This package is preconfigured for a repository owned by **`@MontrealAI`**.

The active `.github/CODEOWNERS` file already assigns repository, application, security, documentation, and Web3-sensitive review to `@MontrealAI`. After the first successful CI run, enable branch protection or a repository ruleset requiring pull requests, passing checks, and CODEOWNER review.

If MontrealAI later creates dedicated teams, update CODEOWNERS with real teams that have repository write access, such as `@MontrealAI/product`, `@MontrealAI/engineering`, or `@MontrealAI/security`.

## Quick start for nontechnical owners

Open:

```text
GITHUB_REPOSITORY_START_HERE.html
```

That guide walks through creating the GitHub repository, uploading this package, checking that CI is green, and protecting the `main` branch.

## Quick start for developers

```bash
npm ci
npm run check
npm run package:verify
npm run hybrid:anchor:check
```

Optional blockchain anchor package:

```bash
npm --prefix blockchain ci
npm --prefix blockchain run package:verify
npm --prefix blockchain run test
```

## Repository structure

```text
src/                         Next.js application
supabase/                    Database migrations and RLS setup
services/anchor-relayer/     Optional verified-receipt relayer helpers
blockchain/                  Optional Sepolia-first receipt anchoring contract
schemas/                     Receipt, evidence, change request, and anchor schemas
config/                      Product policy, feature flags, launch gates
docs/                        Product, launch, security, and operations documentation
docs/elite-documentation-series/  Executive, corporate, GTM, support, and ops docs
.github/                     CI, Dependabot, issue templates, CODEOWNERS
TOOLS/                       Receipt key and offline verification helpers
```

## Product status

| Area | Status |
|---|---|
| Mainstream Signoff workflow | Private-beta ready |
| Signed Mission Receipts | Private-beta ready |
| Evidence assistant | Private-beta ready |
| Optional verified receipt | Sepolia-first pilot path |
| Mainnet anchoring | Later, after review |
| AGIALPHA bonded review | Roadmap only |
| Escrow / proof-to-payment | Roadmap only |

## First private-beta target

```text
10 real Signoffs attempted
7 completed end-to-end
3 users say they would use it again
0 lost evidence
0 broken receipts
0 security incidents
```

## Essential docs

- `GITHUB_REPOSITORY_START_HERE.html` — nontechnical repository launch guide
- `docs/repository/GITHUB_UPLOAD_GUIDE.md` — upload using GitHub Desktop or browser
- `docs/repository/REPOSITORY_SETTINGS_CHECKLIST.md` — branch, Actions, security, and review settings
- `docs/PRO_V1_1_PRODUCT_SPEC.md` — product specification
- `docs/PRO_V1_1_LAUNCH_PLAYBOOK.md` — launch plan
- `docs/SECURITY_AND_PRIVACY.md` — security model
- `docs/MAINNET_AND_ESCROW_BOUNDARY.md` — safety boundaries
- `docs/elite-documentation-series/DOCS_INDEX.html` — complete corporate documentation index

## Safety boundary

Do not add private keys, seed phrases, wallet mnemonics, production service-role keys, or Mainnet deployer secrets to this repository. Use `.env.example` as a template only, and store real secrets inside your deployment provider or protected GitHub environments.

## License

See `LICENSE`.
