# GitHub Web UI Installation Steps

Use these steps if you do not want to use the command line.

## Files to add or replace

Download the ZIP package, unzip it, then add these files into `MontrealAI/goalos-signoff-pro` using GitHub's web UI.

### 1. Add config

Create:

```text
config/sovereign-machine-economy.json
```

Paste the file from the package.

Commit message:

```text
Add Sovereign Machine Economy source
```

### 2. Add schema

Create:

```text
schemas/sovereign-machine-economy.schema.json
```

Commit message:

```text
Add Sovereign Machine Economy schema
```

### 3. Add implementation files

Create these files:

```text
src/lib/sovereign-machine-economy/types.ts
src/lib/sovereign-machine-economy/canonical.ts
src/lib/sovereign-machine-economy/validate.ts
src/lib/sovereign-machine-economy/index.ts
src/lib/sovereign-machine-economy/validate.test.ts
```

Commit message:

```text
Add Sovereign Machine Economy implementation model
```

### 4. Add scripts

Create:

```text
scripts/build-sovereign-machine-economy-pages.mjs
scripts/verify-sovereign-machine-economy.mjs
```

Commit message:

```text
Add Sovereign Machine Economy website generator and parity verifier
```

### 5. Add autonomous parity workflow

Create:

```text
.github/workflows/sovereign-machine-economy.yml
```

Commit message:

```text
Add Sovereign Machine Economy parity gate
```

### 6. Replace Pages workflow

Open:

```text
.github/workflows/pages.yml
```

Replace the whole file with the package version.

Commit message:

```text
Deploy Signoff Pro with Sovereign Machine Economy pages
```

## Run the checks

Open:

```text
Actions → Sovereign Machine Economy parity gate → Run workflow → main
```

Expected result:

```text
PASS
```

Then open:

```text
Actions → Deploy GoalOS Signoff Pro production site → Run workflow → main
```

Expected result:

```text
Build and verify public production site    PASS
Deploy to GitHub Pages                     PASS
```

## Verify production

Open:

```text
https://montrealai.github.io/goalos-signoff-pro/sovereign-machine-economy.html
https://montrealai.github.io/goalos-signoff-pro/proof-os.html
https://montrealai.github.io/goalos-signoff-pro/machine-economy.html
https://montrealai.github.io/goalos-signoff-pro/constitution.html
https://montrealai.github.io/goalos-signoff-pro/proof-missions.html
https://montrealai.github.io/goalos-signoff-pro/sme-manifest.json
```

## Do not add secrets

Do not upload:

```text
.env
.env.local
Supabase service-role key
Stripe live secret key
wallet private key
seed phrase
mnemonic
Mainnet deployer key
```
