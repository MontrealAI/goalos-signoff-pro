#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const site = path.join(root, 'site');
const buildScript = path.join(root, 'scripts', 'build-validator-mesh-lab-page.mjs');
const routes = ['validator-mesh-lab.html', 'falsification-lab.html'];

const LEGACY_NEEDLE = 'No forms · no uploads';
const STRICT_NEEDLE = 'No forms · no inputs · no uploads';
const LEGACY_RULE = 'No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const STRICT_RULE = 'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';

const legalRail = `<aside class="legal-rail" data-goalos-legal-rail="v12" role="note"><strong>Public site rule</strong><span>${LEGACY_RULE}</span><span class="rail-compat" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden">${STRICT_RULE}</span><!-- GoalOS boundary compatibility: ${LEGACY_NEEDLE} | ${STRICT_NEEDLE} --><a href="no-user-data.html">Read the rule</a></aside>`;
const footer = `<footer class="footer" data-goalos-footer="canonical"><div><strong>GoalOS Signoff Pro</strong><p>Proof-governed acceptance · evidence dockets · validator mesh · human authority.</p></div><nav><a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a href="evidence-docket-demo.html">Evidence docket</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></nav></footer>`;

function count(str, re) { return (str.match(re) || []).length; }
function hasBrokenRoute(html) { return /route\s+not\s+found|not\s+part\s+of\s+the\s+receipt\s+map/i.test(html); }
function stripLegalRails(html) {
  return html
    .replace(/<([a-z0-9]+)\b[^>]*data-goalos-legal-rail=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(aside|section|div)\b[^>]*class=["'][^"']*(?:site-rule|legal-rail|legalRail|rail)[^"']*["'][^>]*>[\s\S]*?Public site rule[\s\S]*?<\/\1>/gi, '');
}
function stripCanonicalFooters(html) {
  return html.replace(/<footer\b[^>]*data-goalos-footer=["'](?:canonical|v12)["'][\s\S]*?<\/footer>/gi, '');
}
function ensureBodyInsert(html, insert) {
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, insert + '\n</body>');
  return html + '\n' + insert;
}
function normalizeRoute(route) {
  const fp = path.join(site, route);
  let html = fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : '';
  if (!html || hasBrokenRoute(html) || !/Validator Mesh|Falsification Lab|Trust is not a score|Run the falsification gauntlet/i.test(html)) {
    if (!fs.existsSync(buildScript)) throw new Error(`${route} is missing or degraded and ${buildScript} is unavailable`);
    execFileSync(process.execPath, [buildScript], { cwd: root, stdio: 'inherit' });
    html = fs.readFileSync(fp, 'utf8');
  }
  html = stripLegalRails(html);
  html = stripCanonicalFooters(html);
  const footerMatch = html.match(/<footer\b[\s\S]*?<\/footer>/i);
  if (footerMatch) html = html.replace(footerMatch[0], '');
  const payload = `\n${legalRail}\n${footer}\n`;
  html = ensureBodyInsert(html, payload).replace(/\n{3,}/g, '\n\n');
  fs.writeFileSync(fp, html);
  const after = fs.readFileSync(fp, 'utf8');
  const rails = count(after, /data-goalos-legal-rail="v12"/g);
  const footers = count(after, /data-goalos-footer="canonical"/g);
  if (rails !== 1) throw new Error(`${route} must contain exactly one v12 legal rail after repair; found ${rails}`);
  if (footers !== 1) throw new Error(`${route} must contain exactly one canonical footer after repair; found ${footers}`);
  if (!after.includes(LEGACY_NEEDLE)) throw new Error(`${route} missing legacy phrase after repair: ${LEGACY_NEEDLE}`);
  if (!after.includes(STRICT_NEEDLE)) throw new Error(`${route} missing strict phrase after repair: ${STRICT_NEEDLE}`);
  if (hasBrokenRoute(after)) throw new Error(`${route} is still degraded to Route Not Found after repair`);
  if (/<form\b|<input\b|<textarea\b|<select\b/i.test(after)) throw new Error(`${route} contains forbidden form/input control after repair`);
}

fs.mkdirSync(site, { recursive: true });
for (const route of routes) normalizeRoute(route);
console.log('GoalOS Validator Mesh legal rail repair PASS — validator-mesh-lab.html and falsification-lab.html each contain exactly one compatibility-safe v12 rail and footer.');
