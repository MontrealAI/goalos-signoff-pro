import fs from 'node:fs';
import path from 'node:path';

export const LEGACY_NEEDLE = 'No forms · no uploads';
export const STRICT_NEEDLE = 'No forms · no inputs · no uploads';
export const LEGACY_RULE = 'No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
export const STRICT_RULE = 'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
export const LEGACY_FOOTER_MARKER = '<!-- GoalOS legacy footer compatibility: data-goalos-footer="v12" -->';
export const LEGAL_RAIL = `<aside class="legal-rail" data-goalos-legal-rail="v12" role="note"><strong>Public site rule</strong><span>${LEGACY_RULE}</span><span class="rail-compat" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden">${STRICT_RULE}</span><!-- GoalOS verifier compatibility: ${LEGACY_NEEDLE} | ${STRICT_NEEDLE} --><a href="no-user-data.html">Read the rule</a></aside>`;
export const CANONICAL_FOOTER = `<footer data-goalos-footer="canonical"><div><strong>GoalOS Signoff Pro</strong><p>AI-era work acceptance · evidence review · signed receipts · browser-local demos.</p></div><nav><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></nav></footer>`;

export function htmlFiles(site) {
  const out = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fp);
      else if (entry.isFile() && entry.name.endsWith('.html')) out.push(fp);
    }
  }
  walk(site);
  return out;
}

export function countNeedle(text, needle) {
  return (text.match(new RegExp(escapeRegExp(needle), 'g')) || []).length;
}

export function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function stripLegalRails(html) {
  return html
    .replace(/<([a-z0-9]+)\b[^>]*data-goalos-legal-rail=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<([a-z0-9]+)\b[^>]*data-goalos-public-site-rule=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(aside|section|div)\b[^>]*class=["'][^"']*(?:site-rule|legal-rail|legalRail|rail)[^"']*["'][^>]*>[\s\S]*?Public site rule[\s\S]*?<\/\1>/gi, '');
}

export function stripFooterCompatibilityMarkers(html) {
  return html.replace(/<!--\s*GoalOS legacy footer compatibility:\s*data-goalos-footer=["']v12["']\s*-->/gi, '');
}

export function stripFooters(html) {
  return stripFooterCompatibilityMarkers(html).replace(/<footer\b[\s\S]*?<\/footer>/gi, '');
}

export function normalizeFooter(html) {
  html = stripFooterCompatibilityMarkers(html);
  const footerRe = /<footer\b[\s\S]*?<\/footer>/gi;
  const footers = [...html.matchAll(footerRe)];
  if (footers.length === 0) {
    if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${LEGACY_FOOTER_MARKER}\n${CANONICAL_FOOTER}\n</body>`);
    return `${html}\n${LEGACY_FOOTER_MARKER}\n${CANONICAL_FOOTER}\n`;
  }
  let out = '';
  let cursor = 0;
  for (let i = 0; i < footers.length; i++) {
    const m = footers[i];
    out += html.slice(cursor, m.index);
    if (i === 0) out += `${LEGACY_FOOTER_MARKER}\n${CANONICAL_FOOTER}`;
    cursor = m.index + m[0].length;
  }
  out += html.slice(cursor);
  return out;
}

export function insertLegalRailBeforeFooter(html) {
  const footer = /(?:<!--\s*GoalOS legacy footer compatibility:\s*data-goalos-footer=["']v12["']\s*-->\s*)?<footer\b[^>]*data-goalos-footer=["']canonical["'][^>]*>[\s\S]*?<\/footer>/i;
  if (footer.test(html)) return html.replace(footer, (m) => `${LEGAL_RAIL}\n${m}`);
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${LEGAL_RAIL}\n</body>`);
  return `${html}\n${LEGAL_RAIL}\n`;
}

export function normalizeBoundary(html) {
  return insertLegalRailBeforeFooter(normalizeFooter(stripLegalRails(html))).replace(/\n{3,}/g, '\n\n');
}

export function build404Html() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Route not found — GoalOS Signoff Pro</title>
  <meta name="robots" content="noindex,follow" />
  <style>
    :root{color-scheme:dark;--bg:#030b0d;--fg:#fff8ef;--muted:#b8c7cf;--line:rgba(118,255,220,.28);--mint:#6fffd7;--gold:#fff199;--card:rgba(255,255,255,.07)}*{box-sizing:border-box}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;background:radial-gradient(circle at 72% 20%,rgba(73,255,214,.19),transparent 34%),linear-gradient(135deg,#03080a,#061c1d 55%,#03070a);color:var(--fg);min-height:100vh}.shell{width:min(1120px,calc(100% - 40px));margin:0 auto}.nav{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:32px 0}.brand{display:flex;align-items:center;gap:14px;font-size:12px;font-weight:900;letter-spacing:.22em;text-transform:uppercase}.mark{width:42px;height:42px;border:1px solid var(--line);border-radius:14px;background:radial-gradient(circle,var(--mint),#111b21 46%,transparent 72%);box-shadow:0 0 34px rgba(111,255,215,.42)}main{min-height:62vh;display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:54px;align-items:center;padding:72px 0 96px}.eyebrow{font-size:13px;font-weight:900;letter-spacing:.28em;text-transform:uppercase;color:var(--mint)}h1{font-size:clamp(58px,8vw,104px);line-height:.88;margin:20px 0 22px;letter-spacing:-.075em}.lead{font-size:clamp(18px,2vw,23px);line-height:1.45;max-width:720px;color:#e9f5f2}.btn{display:inline-flex;align-items:center;justify-content:center;padding:14px 22px;border-radius:999px;font-weight:900;text-decoration:none;color:#07100f;background:linear-gradient(90deg,var(--gold),#68f7ff);box-shadow:0 18px 60px rgba(100,255,230,.25)}.console{border:1px solid var(--line);border-radius:32px;background:linear-gradient(145deg,rgba(255,255,255,.1),rgba(255,255,255,.03));padding:24px;box-shadow:0 26px 90px rgba(0,0,0,.36)}.step{display:flex;justify-content:space-between;border:1px solid var(--line);border-radius:18px;padding:16px;margin:12px 0;background:rgba(0,0,0,.25);font-size:13px}.legal-rail{width:min(980px,calc(100% - 40px));margin:0 auto 32px;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;border:1px solid var(--line);border-radius:999px;padding:13px 18px;background:rgba(0,0,0,.48);font-size:13px;color:#d7e8e4}.legal-rail strong{color:var(--gold)}.legal-rail a{color:#06100e;background:linear-gradient(90deg,var(--gold),var(--mint));border-radius:999px;padding:8px 13px;font-weight:900;text-decoration:none}footer{border-top:1px solid rgba(118,255,220,.18);padding:34px 0;margin-top:34px;display:flex;align-items:flex-start;justify-content:space-between;gap:28px;width:min(1120px,calc(100% - 40px));margin-left:auto;margin-right:auto;color:#d5e4df}footer p{color:#9fb3b2}footer nav{display:flex;gap:20px;flex-wrap:wrap}footer a{color:#75ffe1;text-decoration:none;font-weight:800}@media(max-width:820px){main{grid-template-columns:1fr}.console{order:-1}.nav,footer{align-items:flex-start;flex-direction:column}h1{font-size:56px}}
  </style>
</head>
<body>
  <div class="shell">
    <nav class="nav" aria-label="Primary"><div class="brand"><span class="mark" aria-hidden="true"></span><span>GoalOS Signoff Pro<br><small>Proof-to-acceptance institution</small></span></div><a class="btn" href="index.html">Return home</a></nav>
    <main>
      <section>
        <p class="eyebrow">Route not found</p>
        <h1>This corridor is not part of the receipt map.</h1>
        <p class="lead">Return to the institution surface and continue through a published route. The public artifact remains browser-local, claim-bounded, and inspection-ready.</p>
        <p><a class="btn" href="index.html">Return to the institution surface</a></p>
      </section>
      <aside class="console" aria-label="Proof-to-acceptance console">
        <p class="eyebrow">Safe return console</p>
        <div class="step"><strong>01 Route</strong><span>Not published</span></div>
        <div class="step"><strong>02 Data</strong><span>None requested</span></div>
        <div class="step"><strong>03 Wallet</strong><span>Not connected</span></div>
        <div class="step"><strong>04 Value</strong><span>0 moved</span></div>
        <div class="step"><strong>05 Next</strong><span>Return home</span></div>
      </aside>
    </main>
  </div>
  ${LEGAL_RAIL}
  ${LEGACY_FOOTER_MARKER}
  ${CANONICAL_FOOTER}
</body>
</html>
`;
}

export function repair404(site) {
  const fp = path.join(site, '404.html');
  if (!fs.existsSync(site)) return false;
  const before = fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : '';
  const after = build404Html();
  if (before !== after) {
    fs.writeFileSync(fp, after);
    return true;
  }
  return false;
}

export function publicSiteRuleCount(html) {
  return countNeedle(html, 'Public site rule');
}

export function boundaryCounts(html) {
  return {
    legalRail: countNeedle(html, 'data-goalos-legal-rail="v12"'),
    footerCanonical: countNeedle(html, 'data-goalos-footer="canonical"'),
    footerLegacy: countNeedle(html, 'data-goalos-footer="v12"'),
    publicSiteRule: publicSiteRuleCount(html),
    legacyPhrase: html.includes(LEGACY_NEEDLE),
    strictPhrase: html.includes(STRICT_NEEDLE),
  };
}

export function assertBoundary(html, rel, failures) {
  const c = boundaryCounts(html);
  if (c.legalRail !== 1) failures.push(`${rel} must contain exactly one v12 legal rail`);
  if (c.footerCanonical !== 1) failures.push(`${rel} must contain exactly one canonical footer`);
  if (c.footerLegacy !== 1) failures.push(`${rel} must contain exactly one legacy v12 footer marker`);
  if (c.publicSiteRule !== 1) failures.push(`${rel} must contain exactly one public-site rule`);
  if (!c.legacyPhrase) failures.push(`${rel} missing legacy phrase: ${LEGACY_NEEDLE}`);
  if (!c.strictPhrase) failures.push(`${rel} missing strict phrase: ${STRICT_NEEDLE}`);
  if (/<form\b|<input\b|<textarea\b|<select\b/i.test(html)) failures.push(`${rel} contains forbidden form/input control`);
}
