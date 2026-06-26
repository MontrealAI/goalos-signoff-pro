#!/usr/bin/env node
import { mkdirSync, rmSync, writeFileSync, readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, basename } from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const out = join(root, "site");
const repository = process.env.GITHUB_REPOSITORY || "MontrealAI/goalos-signoff-pro";
const expectedRepository = process.env.EXPECTED_REPOSITORY || "MontrealAI/goalos-signoff-pro";
const productionUrl = process.env.PRODUCTION_URL || "https://montrealai.github.io/goalos-signoff-pro/";
const runId = process.env.GITHUB_RUN_ID || "local";
const runNumber = process.env.GITHUB_RUN_NUMBER || "local";
const commit = process.env.GITHUB_SHA || "local";
const refName = process.env.GITHUB_REF_NAME || "local";
const generatedAt = new Date().toISOString();

if (repository !== expectedRepository && process.env.GITHUB_ACTIONS === "true") {
  throw new Error(`Refusing to publish from ${repository}; expected ${expectedRepository}`);
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
function slug(value) { return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function fileSha256(path) { return createHash("sha256").update(readFileSync(path)).digest("hex"); }
function sha256Text(value) { return createHash("sha256").update(value).digest("hex"); }
function readMaybe(path, fallback = "") { try { return readFileSync(join(root, path), "utf8"); } catch { return fallback; } }
function write(path, content) { const full = join(out, path); mkdirSync(dirname(full), { recursive: true }); writeFileSync(full, content, "utf8"); }
function json(path, value) { write(path, JSON.stringify(value, null, 2) + "\n"); }
function repoBlob(path) { return `https://github.com/${expectedRepository}/blob/main/${path}`; }
function siteUrl(path = "") { return new URL(path, productionUrl).toString(); }

function discoverDocs(max = 18) {
  const docsRoot = join(root, "docs");
  const results = [];
  const priority = [
    "docs/elite-documentation-series/01_EXECUTIVE_BRIEF.md",
    "docs/elite-documentation-series/02_PRODUCT_STRATEGY.md",
    "docs/elite-documentation-series/03_USER_JOURNEYS.md",
    "docs/elite-documentation-series/04_PRODUCT_REQUIREMENTS.md",
    "docs/elite-documentation-series/05_MVP_SCOPE_AND_BOUNDARIES.md",
    "docs/elite-documentation-series/10_SECURITY_PRIVACY_TRUST_MODEL.md",
    "docs/elite-documentation-series/12_MISSION_RECEIPT_AND_VERIFICATION_GUIDE.md",
    "docs/elite-documentation-series/13_OPTIONAL_VERIFIED_RECEIPTS.md",
    "docs/elite-documentation-series/14_AGIALPHA_AND_48_CONTRACT_ROADMAP.md",
    "docs/elite-documentation-series/20_PRIVATE_BETA_PILOT_PLAN.md",
    "docs/elite-documentation-series/32_WEB3_VERIFICATION_RUNBOOK.md",
    "docs/elite-documentation-series/34_ESCROW_AND_PROOF_TO_PAYMENT_BOUNDARY.md"
  ];
  for (const p of priority) if (existsSync(join(root, p))) results.push(p);
  function walk(dir) {
    if (!existsSync(dir) || results.length >= max) return;
    for (const name of readdirSync(dir).sort()) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) walk(full);
      else if (name.endsWith(".md")) {
        const rel = relative(root, full);
        if (!results.includes(rel)) results.push(rel);
      }
      if (results.length >= max) return;
    }
  }
  walk(docsRoot);
  return results.slice(0, max);
}

const packageJson = (() => {
  try { return JSON.parse(readMaybe("package.json", "{}")); } catch { return {}; }
})();
const readme = readMaybe("README.md", "# GoalOS Signoff Pro");
const version = packageJson.version || "1.1.0";
const docs = discoverDocs();

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "assets"), { recursive: true });

const css = `:root{color-scheme:dark;--bg:#03050a;--panel:#0b1020;--panel2:#111827;--ink:#f8fafc;--muted:#a7b0c0;--line:rgba(148,163,184,.22);--gold:#f6d365;--gold2:#b9891d;--ice:#a7f3ff;--blue:#7dd3fc;--green:#8ef0b4;--red:#fda4af;--shadow:0 32px 110px rgba(0,0,0,.42);--max:1220px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;background:radial-gradient(circle at 15% 0%,rgba(246,211,101,.17),transparent 31%),radial-gradient(circle at 78% 2%,rgba(125,211,252,.15),transparent 30%),linear-gradient(180deg,#040712 0%,#07101d 42%,#020409 100%);color:var(--ink);line-height:1.6}.skip{position:absolute;left:-999px;top:auto}.skip:focus{left:16px;top:16px;z-index:99;background:#fff;color:#000;padding:10px 14px;border-radius:10px}.frame{min-height:100vh;overflow:hidden}.nav{position:sticky;top:0;z-index:20;backdrop-filter:blur(22px);background:rgba(3,5,10,.72);border-bottom:1px solid var(--line)}.nav-inner{max-width:var(--max);margin:auto;padding:16px 22px;display:flex;align-items:center;justify-content:space-between;gap:18px}.brand{display:flex;align-items:center;gap:12px;color:#fff;text-decoration:none}.mark{width:38px;height:38px;border-radius:13px;background:linear-gradient(135deg,var(--gold),#fff7cc 45%,#80e6ff);box-shadow:0 0 44px rgba(246,211,101,.25)}.brand strong{letter-spacing:-.03em}.links{display:flex;align-items:center;gap:18px;flex-wrap:wrap}.links a{color:#dce7f4;text-decoration:none;font-size:14px}.links a:hover{color:#fff}.container{max-width:var(--max);margin:auto;padding:72px 22px}.hero{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(320px,.88fr);gap:34px;align-items:center;padding-top:48px}.eyebrow{display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(246,211,101,.35);background:rgba(246,211,101,.08);color:#ffe8a0;border-radius:999px;padding:8px 12px;font-size:13px;letter-spacing:.04em;text-transform:uppercase}.orb{width:7px;height:7px;border-radius:50%;background:var(--gold);box-shadow:0 0 22px var(--gold)}h1{font-size:clamp(48px,8vw,96px);line-height:.9;letter-spacing:-.08em;margin:22px 0 22px}h1 span{background:linear-gradient(90deg,#fff,#ffe7a3 42%,#a7f3ff);-webkit-background-clip:text;color:transparent}.lead{font-size:clamp(20px,2.2vw,27px);line-height:1.35;color:#dbe7f7;max-width:840px}.actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:30px}.btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;text-decoration:none;border-radius:15px;padding:14px 18px;font-weight:800;border:1px solid rgba(255,255,255,.14);transition:transform .18s ease,background .18s ease}.btn:hover{transform:translateY(-1px)}.primary{background:linear-gradient(135deg,#fff3bc,var(--gold));color:#111827;box-shadow:0 14px 42px rgba(246,211,101,.18)}.secondary{background:rgba(255,255,255,.06);color:#fff}.hero-card{position:relative;border:1px solid var(--line);border-radius:32px;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.035));box-shadow:var(--shadow);padding:26px;overflow:hidden}.hero-card:before{content:"";position:absolute;inset:-80px -60px auto auto;width:220px;height:220px;background:radial-gradient(circle,rgba(246,211,101,.22),transparent 65%)}.cert{position:relative;border:1px solid rgba(246,211,101,.28);background:linear-gradient(180deg,rgba(8,13,25,.95),rgba(16,24,39,.9));border-radius:24px;padding:24px}.cert-head{display:flex;justify-content:space-between;gap:14px;border-bottom:1px solid var(--line);padding-bottom:16px;margin-bottom:16px}.seal{width:62px;height:62px;border-radius:50%;border:1px solid rgba(246,211,101,.65);display:grid;place-items:center;color:#ffe8a0;font-weight:900}.status{display:grid;gap:12px}.row{display:flex;justify-content:space-between;gap:16px;padding:11px 0;border-bottom:1px solid rgba(148,163,184,.13)}.row b{font-weight:800}.ok{color:var(--green)}.muted{color:var(--muted)}.section-title{max-width:790px;margin-bottom:28px}.section-title h2{font-size:clamp(34px,5vw,58px);line-height:1;letter-spacing:-.055em;margin:0 0 14px}.section-title p{font-size:19px;color:#cbd5e1}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.card{border:1px solid var(--line);border-radius:26px;padding:24px;background:rgba(15,23,42,.72);box-shadow:0 20px 64px rgba(0,0,0,.22)}.card h3{font-size:22px;margin:0 0 10px;letter-spacing:-.025em}.kicker{color:var(--gold);font-weight:900;font-size:13px;letter-spacing:.08em;text-transform:uppercase}.metric{font-size:42px;line-height:1;font-weight:900;letter-spacing:-.04em;color:#fff}.ribbon{border:1px solid rgba(125,211,252,.24);background:linear-gradient(135deg,rgba(125,211,252,.12),rgba(246,211,101,.08));border-radius:30px;padding:30px;display:grid;grid-template-columns:1fr auto;gap:22px;align-items:center}.steps{counter-reset:step}.step{position:relative;padding-left:58px;margin:0 0 18px}.step:before{counter-increment:step;content:counter(step);position:absolute;left:0;top:2px;width:36px;height:36px;border-radius:13px;background:linear-gradient(135deg,var(--gold),#fef3c7);color:#111827;font-weight:900;display:grid;place-items:center}.panel{border:1px solid var(--line);border-radius:30px;background:#060a13;overflow:hidden}.panel-head{padding:16px 20px;border-bottom:1px solid var(--line);display:flex;gap:8px}.dot{width:10px;height:10px;border-radius:50%;background:#334155}.terminal{padding:22px;font-family:"SFMono-Regular",Consolas,monospace;color:#d1fae5;font-size:14px;white-space:pre-wrap}.docs-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.docs-list a{display:block;padding:13px 14px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.035);color:#dbeafe;text-decoration:none}.docs-list a:hover{background:rgba(125,211,252,.09)}footer{border-top:1px solid var(--line);padding:36px 22px;color:#9ca3af}.footer-inner{max-width:var(--max);margin:auto;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap}code{background:#0a1220;border:1px solid var(--line);border-radius:8px;padding:2px 6px;color:#dff6ff}.badge-line{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.pill{font-size:13px;padding:8px 10px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.045);color:#cbd5e1}@media(max-width:900px){.hero,.grid,.grid2,.ribbon{grid-template-columns:1fr}.links{display:none}.container{padding:48px 18px}h1{font-size:56px}.docs-list{grid-template-columns:1fr}.hero-card{padding:18px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}`;
write("assets/institutional.css", css);

const pages = [
  { path: "", title: "GoalOS Signoff Pro — AI Work Acceptance Infrastructure", description: "Institutional-grade acceptance, evidence review, signed Mission Receipts, and optional verified receipt anchoring for AI-assisted work." },
  { path: "platform.html", title: "Platform — GoalOS Signoff Pro", description: "Define done, collect evidence, review deliverables, and issue signed Mission Receipts." },
  { path: "trust.html", title: "Trust Architecture — GoalOS Signoff Pro", description: "Security posture, receipt verification, privacy boundaries, and optional IPFS/Ethereum anchoring." },
  { path: "pilot.html", title: "Private Beta — GoalOS Signoff Pro", description: "A controlled private-beta plan for AI consultants, agencies, research teams, and enterprise AI pilots." },
  { path: "docs.html", title: "Documentation — GoalOS Signoff Pro", description: "Executive, product, engineering, security, and pilot documentation for GoalOS Signoff Pro." }
];

function layout(page, body) {
  const canonical = siteUrl(page.path);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GoalOS Signoff Pro",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: productionUrl,
    description: "AI work acceptance infrastructure for briefs, evidence review, human signoff, and signed Mission Receipts.",
    softwareVersion: version,
    publisher: { "@type": "Organization", name: "MontrealAI", url: "https://github.com/MontrealAI" }
  };
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <link rel="canonical" href="${esc(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:site_name" content="GoalOS Signoff Pro">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#050914">
  <link rel="stylesheet" href="assets/institutional.css">
  <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="frame">
<nav class="nav" aria-label="Primary navigation"><div class="nav-inner"><a class="brand" href="index.html"><span class="mark" aria-hidden="true"></span><strong>GoalOS Signoff Pro</strong></a><div class="links"><a href="platform.html">Platform</a><a href="trust.html">Trust</a><a href="pilot.html">Pilot</a><a href="docs.html">Docs</a><a href="production-manifest.json">Manifest</a></div></div></nav>
${body}
<footer><div class="footer-inner"><div>© ${new Date().getUTCFullYear()} MontrealAI. GoalOS Signoff Pro.</div><div>Commit <code>${esc(commit.slice(0, 12))}</code> · Run <code>${esc(runId)}</code></div></div></footer>
</div>
</body>
</html>`;
}

function hero() {
  return `<main id="main"><section class="container hero"><div><span class="eyebrow"><span class="orb"></span>Institutional AI work acceptance</span><h1>The acceptance layer for <span>serious AI work.</span></h1><p class="lead">GoalOS Signoff Pro gives consultants, agencies, research teams, and enterprise AI pilots a polished system for defining “done,” reviewing evidence, recording human acceptance, and issuing signed Mission Receipts.</p><div class="actions"><a class="btn primary" href="pilot.html">Plan the private beta</a><a class="btn secondary" href="platform.html">Explore the platform</a><a class="btn secondary" href="trust.html">Review trust posture</a></div><div class="badge-line"><span class="pill">No wallet required for mainstream users</span><span class="pill">No escrow or custody in private beta</span><span class="pill">Optional verified receipts later</span></div></div><aside class="hero-card" aria-label="Mission Receipt preview"><div class="cert"><div class="cert-head"><div><div class="kicker">Mission Receipt</div><h2>Accepted delivery record</h2></div><div class="seal">GS</div></div><div class="status"><div class="row"><span>Brief</span><b>Versioned</b></div><div class="row"><span>Evidence</span><b>Hashed</b></div><div class="row"><span>Review</span><b>Human-led</b></div><div class="row"><span>Decision</span><b class="ok">Accepted</b></div><div class="row"><span>Verification</span><b>Signed</b></div></div></div></aside></section>`;
}

const docLinks = docs.map((d) => `<a href="${esc(repoBlob(d))}">${esc(d.replace(/^docs\//, ""))}</a>`).join("");

const indexBody = `${hero()}<section class="container"><div class="section-title"><h2>Built for executive clarity and operational trust.</h2><p>Not another AI output screen. A structured, auditable acceptance system for AI-assisted deliverables.</p></div><div class="grid"><div class="card"><div class="kicker">01</div><h3>Define done</h3><p class="muted">Briefs, acceptance criteria, evidence requirements, deadlines, and roles are captured before delivery.</p></div><div class="card"><div class="kicker">02</div><h3>Review evidence</h3><p class="muted">The evidence assistant highlights missing criteria, unmapped files, weak limitations, and disclosure gaps.</p></div><div class="card"><div class="kicker">03</div><h3>Issue receipts</h3><p class="muted">Accepted work produces signed Mission Receipts with artifact fingerprints and revision history.</p></div></div></section><section class="container"><div class="ribbon"><div><div class="kicker">Institutional posture</div><h2>Private-beta ready. Mainnet-settlement restrained.</h2><p class="muted">The launch boundary is intentional: mainstream SaaS first, optional verification second, AGIALPHA-secured settlement only after protocol gates are ready.</p></div><a class="btn primary" href="trust.html">See trust model</a></div></section></main>`;
write("index.html", layout(pages[0], indexBody));

const platformBody = `<main id="main"><section class="container"><div class="section-title"><span class="eyebrow"><span class="orb"></span>Platform</span><h1>From vague delivery to accepted work.</h1><p>GoalOS Signoff Pro turns AI-assisted work into a disciplined acceptance workflow that clients, builders, and reviewers can understand.</p></div><div class="grid2"><div class="card steps"><div class="step"><h3>Create the brief</h3><p class="muted">Select a template, define acceptance criteria, assign parties, and record limitations.</p></div><div class="step"><h3>Submit evidence</h3><p class="muted">Attach artifacts, map evidence to criteria, and preserve file fingerprints.</p></div><div class="step"><h3>Request changes</h3><p class="muted">Use revision loops before final acceptance. The receipt records which version was accepted.</p></div><div class="step"><h3>Accept and verify</h3><p class="muted">Issue a signed Mission Receipt and optionally add IPFS/Ethereum anchoring later.</p></div></div><div class="panel"><div class="panel-head"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div><div class="terminal">brief.status     = versioned\nevidence.mapping = complete\nreview.decision  = human_authority\nreceipt.signature= verified\nsettlement        = disabled_private_beta\nwallet_required   = false</div></div></div></section></main>`;
write("platform.html", layout(pages[1], platformBody));

const trustBody = `<main id="main"><section class="container"><div class="section-title"><span class="eyebrow"><span class="orb"></span>Trust architecture</span><h1>Polished product. Explicit boundaries.</h1><p>Trust comes from clear authority, evidence fingerprints, human acceptance, receipt signing, and restrained scope.</p></div><div class="grid"><div class="card"><div class="metric">0</div><h3>Customer custody</h3><p class="muted">The private beta does not hold customer funds and does not operate escrow.</p></div><div class="card"><div class="metric">0</div><h3>Required tokens</h3><p class="muted">Mainstream users do not need AGIALPHA, ETH, wallet setup, or token approvals.</p></div><div class="card"><div class="metric">1</div><h3>Human decision</h3><p class="muted">The software prepares evidence. The client or reviewer decides acceptance.</p></div></div><div class="grid2" style="margin-top:18px"><div class="card"><h3>Verification layers</h3><ul><li>File fingerprints</li><li>Signed receipt payload</li><li>Revision history</li><li>Public verification page</li><li>Optional IPFS/Ethereum anchoring</li></ul></div><div class="card"><h3>Launch boundaries</h3><ul><li>No Mainnet settlement claim</li><li>No user-fund authorization</li><li>No AGIALPHA staking launch</li><li>No external audit claim</li><li>No autonomous acceptance decision</li></ul></div></div></section></main>`;
write("trust.html", layout(pages[2], trustBody));

const pilotBody = `<main id="main"><section class="container"><div class="section-title"><span class="eyebrow"><span class="orb"></span>Private beta</span><h1>Launch narrowly. Learn quickly. Earn trust.</h1><p>A premium product posture begins with a controlled pilot and measurable proof that Signoff creates customer value.</p></div><div class="grid"><div class="card"><div class="metric">10</div><h3>Signoffs attempted</h3><p class="muted">Use real work, not synthetic demos.</p></div><div class="card"><div class="metric">7</div><h3>Completed end-to-end</h3><p class="muted">Brief, evidence, review, decision, receipt.</p></div><div class="card"><div class="metric">0</div><h3>Broken receipts</h3><p class="muted">Evidence and verification must remain intact.</p></div></div><div class="ribbon" style="margin-top:24px"><div><div class="kicker">Best first ICP</div><h2>AI consultants, agencies, research operators, and enterprise pilot leads.</h2><p class="muted">These users already feel the pain of ambiguous AI deliverables and acceptance disputes.</p></div><a class="btn primary" href="docs.html">Open pilot docs</a></div></section></main>`;
write("pilot.html", layout(pages[3], pilotBody));

const docsBody = `<main id="main"><section class="container"><div class="section-title"><span class="eyebrow"><span class="orb"></span>Documentation</span><h1>Board-ready docs, without exposing internal artifacts.</h1><p>The public site links to the repository documentation instead of copying private operational content into Pages.</p></div><div class="docs-list">${docLinks}</div></section></main>`;
write("docs.html", layout(pages[4], docsBody));
write("404.html", layout({ ...pages[0], title: "Page not found — GoalOS Signoff Pro", path: "404.html" }, `${hero()}<section class="container"><div class="card"><h2>Page not found</h2><p class="muted">Return to the institutional front door.</p><a class="btn primary" href="index.html">Go home</a></div></section></main>`));
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${siteUrl("sitemap.xml")}\n`);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${esc(siteUrl(p.path))}</loc><lastmod>${generatedAt.slice(0,10)}</lastmod></url>`).join("\n")}\n</urlset>\n`);
write(".nojekyll", "");
write("assets/brand-mark.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f6d365"/><stop offset=".55" stop-color="#fff7cc"/><stop offset="1" stop-color="#7dd3fc"/></linearGradient></defs><rect width="120" height="120" rx="34" fill="#050914"/><path d="M27 63c0-20 13-36 34-36 14 0 25 7 31 18l-17 8c-3-6-8-9-15-9-10 0-17 8-17 19s7 19 18 19c6 0 11-2 14-6v-6H59V55h34v28c-8 10-19 15-33 15-20 0-33-15-33-35Z" fill="url(#g)"/></svg>`);

const generatedFiles = [];
function collectSiteFiles(dir = out) {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) collectSiteFiles(full);
    else {
      const rel = relative(out, full);
      generatedFiles.push({ path: rel, sha256: fileSha256(full), bytes: st.size });
    }
  }
}
collectSiteFiles();

const sourceFiles = ["README.md", "package.json", ".github/CODEOWNERS", ".github/workflows/pages.yml", "scripts/build-institutional-pages.mjs"]
  .filter((p) => existsSync(join(root, p)))
  .map((p) => ({ path: p, sha256: fileSha256(join(root, p)) }));
for (const d of docs) sourceFiles.push({ path: d, sha256: fileSha256(join(root, d)) });

const manifest = {
  product: "GoalOS Signoff Pro",
  posture: "institutional-private-beta-front-door",
  version,
  productionUrl,
  repository: expectedRepository,
  commit,
  refName,
  runId,
  runNumber,
  generatedAt,
  artifactPolicy: "static public Pages site; no copied private docs; no secrets; no customer data",
  boundaries: {
    publicFrontDoorOnly: true,
    mainstreamWalletRequired: false,
    agialphaRequired: false,
    escrowEnabled: false,
    custodyEnabled: false,
    userFundsAuthorized: false,
    optionalVerifiedReceipts: true
  },
  generatedFiles,
  sourceFiles,
  siteHash: sha256Text(generatedFiles.map((f) => `${f.path}:${f.sha256}`).join("\n"))
};
json("production-manifest.json", manifest);

const secretPattern = /(SUPABASE_SERVICE_ROLE|STRIPE_SECRET|PRIVATE_KEY|MNEMONIC|SEED_PHRASE|ETHERSCAN_API_KEY|MAINNET_RPC|BEGIN\s+(RSA|OPENSSH|PRIVATE)|sk_live_|xoxb-)/;
for (const file of generatedFiles) {
  const full = join(out, file.path);
  const text = readFileSync(full, "utf8");
  if (secretPattern.test(text)) throw new Error(`Secret-like text in generated page: ${file.path}`);
}

console.log(`Built elite institutional site for ${productionUrl}`);
console.log(`Generated ${generatedFiles.length} files. Site hash ${manifest.siteHash}.`);
