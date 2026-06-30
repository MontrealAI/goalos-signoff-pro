import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const site = path.join(root, 'site');
const buildScript = path.join(root, 'scripts', 'build-validator-mesh-lab-page.mjs');
const routes = ['validator-mesh-lab.html', 'falsification-lab.html'];
const publicRule = 'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';

const legalRail = `<aside class="legal-rail" data-goalos-legal-rail="v12" role="note"><strong>Public site rule</strong><span>${publicRule}</span><a href="no-user-data.html">Read the rule</a></aside>`;
const footer = `<footer class="footer" data-goalos-footer="canonical"><div><strong>GoalOS Signoff Pro</strong><p>Proof-governed acceptance · evidence dockets · validator mesh · human authority.</p></div><nav><a href="browser-beta.html">Browser beta</a><a href="mission-001.html">Mission 001</a><a href="evidence-docket-demo.html">Evidence docket</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></nav></footer>`;

function count(str, re) { return (str.match(re) || []).length; }
function hasBrokenRoute(html) { return /route\s+not\s+found|not\s+part\s+of\s+the\s+receipt\s+map/i.test(html); }
function stripLegalRails(html) {
  return html
    .replace(/<(aside|section|div)\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/\1>/gi, '')
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
  html = ensureBodyInsert(html, payload);
  fs.writeFileSync(fp, html);
  const after = fs.readFileSync(fp, 'utf8');
  const rails = count(after, /data-goalos-legal-rail="v12"/g);
  const footers = count(after, /data-goalos-footer="canonical"/g);
  if (rails !== 1) throw new Error(`${route} must contain exactly one v12 legal rail after repair; found ${rails}`);
  if (footers !== 1) throw new Error(`${route} must contain exactly one canonical footer after repair; found ${footers}`);
  if (hasBrokenRoute(after)) throw new Error(`${route} is still degraded to Route Not Found after repair`);
}

fs.mkdirSync(site, { recursive: true });
for (const route of routes) normalizeRoute(route);
console.log('GoalOS Validator Mesh legal rail repair PASS — validator-mesh-lab.html and falsification-lab.html each contain exactly one canonical v12 rail and footer.');
