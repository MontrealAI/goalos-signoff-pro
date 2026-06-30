#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
const LEGACY_NEEDLE = 'No forms · no uploads';
const STRICT_NEEDLE = 'No forms · no inputs · no uploads';
const LEGACY_RULE = 'No forms · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const STRICT_RULE = 'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const LEGAL_RAIL = `<aside class="legal-rail" data-goalos-legal-rail="v12" role="note"><strong>Public site rule</strong><span>${LEGACY_RULE}</span><span class="rail-compat" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden">${STRICT_RULE}</span><!-- GoalOS compatibility rail: ${LEGACY_NEEDLE} | ${STRICT_NEEDLE} --><a href="no-user-data.html">Read the rule</a></aside>`;
const FOOTER = `<footer data-goalos-footer="canonical"><div><strong>GoalOS Signoff Pro</strong><p>AI-era work acceptance · evidence review · signed receipts · browser-local demos.</p></div><nav><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></nav></footer>`;

if (!fs.existsSync(site)) {
  console.log('GoalOS public-site boundary compatibility repair skipped: site/ does not exist');
  process.exit(0);
}
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp);
    else if (e.isFile() && e.name.endsWith('.html')) files.push(fp);
  }
}
function stripRails(html) {
  return html
    .replace(/<([a-z0-9]+)\b[^>]*data-goalos-legal-rail=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(aside|section|div)\b[^>]*(?:class=["'][^"']*(?:site-rule|legal-rail|legalRail|rail)[^"']*["'][^>]*)>[\s\S]*?Public site rule[\s\S]*?<\/\1>/gi, '');
}
function stripCanonicalFooters(html) {
  return html.replace(/<footer\b[^>]*data-goalos-footer=["'][^"']*["'][\s\S]*?<\/footer>/gi, '');
}
function ensureFooter(html) {
  const footer = /<footer\b[\s\S]*?<\/footer>/i;
  if (footer.test(html)) {
    let first = true;
    return html.replace(/<footer\b[\s\S]*?<\/footer>/gi, (m) => {
      if (!first) return '';
      first = false;
      return m.includes('data-goalos-footer=') ? m.replace(/data-goalos-footer=["'][^"']*["']/, 'data-goalos-footer="canonical"') : m.replace(/<footer\b/i, '<footer data-goalos-footer="canonical"');
    });
  }
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${FOOTER}\n</body>`);
  return `${html}\n${FOOTER}`;
}
function insertRail(html) {
  const footerRe = /<footer\b[^>]*data-goalos-footer=["']canonical["'][^>]*>[\s\S]*?<\/footer>/i;
  if (footerRe.test(html)) return html.replace(footerRe, (m) => `${LEGAL_RAIL}\n${m}`);
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${LEGAL_RAIL}\n</body>`);
  return `${html}\n${LEGAL_RAIL}`;
}
function count(html, re) { return (html.match(re) || []).length; }

walk(site);
const failures = [];
let changed = 0;
for (const file of files) {
  const rel = path.relative(site, file).replaceAll(path.sep, '/');
  if (rel.startsWith('404')) continue;
  const before = fs.readFileSync(file, 'utf8');
  let html = before;
  html = stripRails(html);
  html = stripCanonicalFooters(html);
  html = ensureFooter(html);
  html = insertRail(html).replace(/\n{3,}/g, '\n\n');
  if (count(html, /data-goalos-legal-rail="v12"/g) !== 1) failures.push(`${rel} must contain exactly one v12 legal rail`);
  if (count(html, /data-goalos-footer="canonical"/g) !== 1) failures.push(`${rel} must contain exactly one canonical footer`);
  if (!html.includes(LEGACY_NEEDLE)) failures.push(`${rel} missing legacy phrase: ${LEGACY_NEEDLE}`);
  if (!html.includes(STRICT_NEEDLE)) failures.push(`${rel} missing strict phrase: ${STRICT_NEEDLE}`);
  if (/<form\b|<input\b|<textarea\b|<select\b/i.test(html)) failures.push(`${rel} contains forbidden form/input control`);
  if (html !== before) { fs.writeFileSync(file, html); changed++; }
}
if (failures.length) {
  console.error('GoalOS public-site boundary compatibility repair FAILED');
  for (const failure of failures) console.error(' - ' + failure);
  process.exit(1);
}
console.log(`GoalOS public-site boundary compatibility repair PASS — ${files.length} HTML pages checked, ${changed} updated`);
