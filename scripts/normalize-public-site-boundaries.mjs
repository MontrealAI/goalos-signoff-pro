import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const LEGAL_RAIL = `<aside class="legal-rail" data-goalos-legal-rail="v12"><strong>Public site rule</strong><span>No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.</span><a href="no-user-data.html">Read the rule</a></aside>`;

const htmlFiles = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fp);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(fp);
  }
}
function removeLegalRails(html) {
  return html
    .replace(/<([a-z0-9]+)\b[^>]*data-goalos-legal-rail=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<aside\b[^>]*class=["'][^"']*legal-rail[^"']*["'][^>]*>[\s\S]*?<\/aside>/gi, '');
}
function normalizeCanonicalFooter(html) {
  const matches = [...html.matchAll(/<footer\b[^>]*data-goalos-footer=["']canonical["'][^>]*>[\s\S]*?<\/footer>/gi)];
  if (matches.length <= 1) return html;
  let out = '';
  let cursor = 0;
  let kept = false;
  for (const match of matches) {
    out += html.slice(cursor, match.index);
    if (!kept) { out += match[0]; kept = true; }
    cursor = match.index + match[0].length;
  }
  return out + html.slice(cursor);
}
function insertLegalRail(html) {
  const footer = /<footer\b[^>]*data-goalos-footer=["']canonical["'][^>]*>[\s\S]*?<\/footer>/i;
  if (footer.test(html)) return html.replace(footer, (m) => `${LEGAL_RAIL}\n${m}`);
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${LEGAL_RAIL}\n</body>`);
  return `${html}\n${LEGAL_RAIL}\n`;
}
function count(html, re) { return (html.match(re) || []).length; }

if (!fs.existsSync(site)) {
  console.log('GoalOS public-site boundary normalizer skipped: site/ does not exist');
  process.exit(0);
}
walk(site);
let changed = 0;
const failures = [];
for (const fp of htmlFiles) {
  const before = fs.readFileSync(fp, 'utf8');
  let html = before;
  html = removeLegalRails(html);
  html = normalizeCanonicalFooter(html);
  html = insertLegalRail(html);
  const railCount = count(html, /data-goalos-legal-rail="v12"/g);
  const footerCount = count(html, /data-goalos-footer="canonical"/g);
  if (railCount !== 1) failures.push(`${path.relative(site, fp)} legal rail count ${railCount}`);
  if (footerCount > 1) failures.push(`${path.relative(site, fp)} canonical footer count ${footerCount}`);
  if (html !== before) { fs.writeFileSync(fp, html); changed++; }
}
if (failures.length) {
  console.error('GoalOS public-site boundary normalizer FAILED');
  failures.forEach(f => console.error(' - ' + f));
  process.exit(1);
}
console.log(`GoalOS public-site boundary normalizer PASS — ${htmlFiles.length} HTML pages checked, ${changed} updated`);
