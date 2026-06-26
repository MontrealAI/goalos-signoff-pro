#!/usr/bin/env node
import { mkdirSync, rmSync, writeFileSync, existsSync, readFileSync, readdirSync, statSync, copyFileSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const out = join(root, "site");
const repoUrl = "https://github.com/MontrealAI/goalos-signoff-pro";
const productionUrl = "https://montrealai.github.io/goalos-signoff-pro/";

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function readMaybe(path, fallback = "") {
  try { return readFileSync(join(root, path), "utf8"); } catch { return fallback; }
}

function listDocs(dir = "docs", max = 80) {
  const full = join(root, dir);
  const rows = [];
  function walk(current) {
    if (!existsSync(current) || rows.length >= max) return;
    for (const name of readdirSync(current).sort()) {
      const path = join(current, name);
      const st = statSync(path);
      if (st.isDirectory()) walk(path);
      else if (name.endsWith(".md")) rows.push(relative(root, path));
      if (rows.length >= max) break;
    }
  }
  walk(full);
  return rows;
}

function write(path, content) {
  const full = join(out, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, "utf8");
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const readme = readMaybe("README.md", "# GoalOS Signoff Pro");
const docs = listDocs();
const runId = process.env.GITHUB_RUN_ID || "local";
const commit = process.env.GITHUB_SHA || "local";
const generatedAt = new Date().toISOString();

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>GoalOS Signoff Pro</title>
  <meta name="description" content="Know when AI work is actually done. Define done, collect evidence, obtain human approval, and issue a signed Mission Receipt.">
  <style>
    :root{color-scheme:dark;--bg:#080b12;--card:#111827;--muted:#9ca3af;--text:#f9fafb;--line:#263244;--accent:#7dd3fc;--ok:#86efac}
    *{box-sizing:border-box}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;background:radial-gradient(circle at top,#14223a,#080b12 42%);color:var(--text);line-height:1.55}
    main{max-width:1120px;margin:auto;padding:56px 20px}.hero{display:grid;gap:24px;grid-template-columns:1.2fr .8fr;align-items:center}.badge{display:inline-flex;padding:7px 11px;border:1px solid var(--line);border-radius:999px;color:var(--accent);background:#0f172a}
    h1{font-size:clamp(42px,7vw,80px);line-height:.95;margin:20px 0}h2{font-size:32px;margin:0 0 12px}.lead{font-size:21px;color:#dbeafe;max-width:760px}.card{background:rgba(17,24,39,.86);border:1px solid var(--line);border-radius:22px;padding:24px;box-shadow:0 20px 70px rgba(0,0,0,.28)}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:34px 0}.two{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:34px 0}.btns{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.btn{display:inline-block;text-decoration:none;padding:13px 18px;border-radius:13px;background:var(--accent);color:#06111f;font-weight:800}.btn.secondary{background:#172033;color:var(--text);border:1px solid var(--line)}
    code{background:#0b1220;padding:2px 6px;border-radius:6px}.muted{color:var(--muted)}li{margin:6px 0}.ok{color:var(--ok);font-weight:700}.docs a{color:#bfdbfe;text-decoration:none}.docs a:hover{text-decoration:underline}
    pre{white-space:pre-wrap;background:#050914;border:1px solid var(--line);border-radius:16px;padding:16px;max-height:360px;overflow:auto}
    @media(max-width:800px){.hero,.grid,.two{grid-template-columns:1fr}main{padding:32px 16px}}
  </style>
</head>
<body>
<main>
  <section class="hero">
    <div>
      <span class="badge">Production public front door</span>
      <h1>Know when AI work is actually done.</h1>
      <p class="lead">GoalOS Signoff Pro helps teams define “done,” collect evidence, obtain human acceptance, issue signed Mission Receipts, and optionally verify receipts on IPFS/Ethereum later.</p>
      <div class="btns">
        <a class="btn" href="#pilot">Start a private beta</a>
        <a class="btn secondary" href="${repoUrl}">View repository</a>
        <a class="btn secondary" href="production-manifest.json">Production manifest</a>
      </div>
    </div>
    <div class="card">
      <h2>Launch boundary</h2>
      <ul>
        <li><span class="ok">No wallet required</span> for mainstream users</li>
        <li><span class="ok">No AGIALPHA required</span></li>
        <li><span class="ok">No escrow or custody</span></li>
        <li><span class="ok">Optional verified receipt path</span></li>
        <li><span class="ok">Human acceptance stays authoritative</span></li>
      </ul>
    </div>
  </section>

  <section class="grid" id="product">
    <div class="card"><h2>1. Define done</h2><p class="muted">Create a brief with acceptance criteria, evidence requirements, deadline, and roles.</p></div>
    <div class="card"><h2>2. Review evidence</h2><p class="muted">Map evidence to each criterion. The assistant flags gaps; humans decide acceptance.</p></div>
    <div class="card"><h2>3. Issue receipt</h2><p class="muted">Produce a signed Mission Receipt with artifact hashes, revision history, and verifier output.</p></div>
  </section>

  <section class="two" id="pilot">
    <div class="card">
      <h2>Private-beta target</h2>
      <ul>
        <li>10 real Signoffs attempted</li>
        <li>7 completed end-to-end</li>
        <li>3 users say they would use it again</li>
        <li>0 lost evidence</li>
        <li>0 broken receipts</li>
      </ul>
    </div>
    <div class="card">
      <h2>Production URL</h2>
      <p><code>${productionUrl}</code></p>
      <p class="muted">Generated by GitHub Actions from commit <code>${esc(commit.slice(0, 12))}</code>.</p>
      <p class="muted">Run ID: <code>${esc(runId)}</code></p>
    </div>
  </section>

  <section class="card docs">
    <h2>Documentation highlights</h2>
    <ul>
      ${docs.slice(0, 36).map((d) => `<li><a href="${esc(d)}">${esc(d)}</a></li>`).join("\n")}
    </ul>
  </section>

  <section class="card">
    <h2>Repository README snapshot</h2>
    <pre>${esc(readme.slice(0, 5000))}</pre>
  </section>
</main>
</body>
</html>`;

write("index.html", html);

const manifest = {
  product: "GoalOS Signoff Pro",
  productionUrl,
  repository: "MontrealAI/goalos-signoff-pro",
  generatedAt,
  commit,
  runId,
  artifactPolicy: "static-public-no-secrets",
  boundaries: {
    userFundsAuthorized: false,
    agialphaRequired: false,
    escrowEnabled: false,
    walletRequiredForMainstreamUsers: false,
    optionalVerifiedReceipts: true
  },
  sourceFiles: []
};

for (const rel of ["README.md", "package.json", ".github/CODEOWNERS"].concat(docs.slice(0, 80))) {
  const full = join(root, rel);
  if (existsSync(full) && statSync(full).isFile()) {
    manifest.sourceFiles.push({ path: rel, sha256: sha256File(full) });
    if (rel.startsWith("docs/")) {
      const target = join(out, rel);
      mkdirSync(dirname(target), { recursive: true });
      copyFileSync(full, target);
    }
  }
}

write("production-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
write("404.html", html);
console.log(`Built ${productionUrl}`);
