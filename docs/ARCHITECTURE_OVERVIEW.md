# Architecture Overview

Purpose: summarize repo, site, builders, verifiers, and public-safe artifacts.

Best first action: open [`site/goalos-v22-v35-command-center.html`](../site/goalos-v22-v35-command-center.html), then continue to the recommended lab.

Relevant routes: [`site/index.html`](../site/index.html), [`site/public-demo-labs.html`](../site/public-demo-labs.html), [`site/goalos-v22-v35-command-center.html`](../site/goalos-v22-v35-command-center.html), [`site/loop-rsi-asi-superintelligence-mission-simulator-lab.html`](../site/loop-rsi-asi-superintelligence-mission-simulator-lab.html).

Verification command: `npm run site:all`.

Public-safe boundary: no forms, no inputs, no uploads, no cookies, no analytics, no wallets, no payments, no external AI calls, no personal data, zero value moved. This is not legal advice, financial advice, investment advice, live settlement, achieved AGI/ASI, or production RSI.

Architecture: `config/*.json` stores route/manifest source; `scripts/build-*.mjs` regenerates static pages and manifests; `scripts/verify-*.mjs` enforces public-safe, route, workflow, and lab gates; `site/` is GitHub Pages output; `docs/` explains review paths.

Back to [docs index](INDEX.md).
