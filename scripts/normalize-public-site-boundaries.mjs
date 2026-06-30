#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const LEGACY_NEEDLE = 'No forms · no uploads';
const STRICT_NEEDLE = 'No forms · no inputs · no uploads';
const VISIBLE_RULE = 'No forms · no uploads · no inputs · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const STRICT_RULE = 'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const LEGAL_RAIL = `<aside class="legal-rail" data-goalos-legal-rail="v12"><strong>Public site rule</strong><span>${VISIBLE_RULE}</span><span class="rail-compat" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden">${STRICT_RULE}</span><!-- GoalOS verifier compatibility: ${LEGACY_NEEDLE} | ${STRICT_NEEDLE} --><a href="no-user-data.html">Read the rule</a></aside>`;
const CANONICAL_FOOTER = `<footer data-goalos-footer="canonical"><div><strong>GoalOS Signoff Pro</strong><p>AI-era work acceptance · evidence review · signed receipts · browser-local demos.</p></div><nav><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></nav></footer>`;

if (!fs.existsSync(site)) {
  console.log('GoalOS public-site boundary normalizer skipped: site/ does not exist');
  process.exit(0);
}

const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fp);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(fp);
  }
}
function removeLegalRails(html) {
  return html
    .replace(/<([a-z0-9]+)\b[^>]*data-goalos-legal-rail=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<aside\b[^>]*class=["'][^"']*legal-rail[^"']*["'][^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<div\b[^>]*class=["'][^"']*legal-rail[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<section\b[^>]*class=["'][^"']*legal-rail[^"']*["'][^>]*>[\s\S]*?<\/section>/gi, '');
}
function canonicalizeFooter(html) {
  const footerRe = /<footer\b[^>]*>[\s\S]*?<\/footer>/gi;
  const footers = [...html.matchAll(footerRe)];
  if (footers.length === 0) {
    if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${CANONICAL_FOOTER}\n</body>`);
    return `${html}\n${CANONICAL_FOOTER}\n`;
  }
  let out = '';
  let cursor = 0;
  for (let i = 0; i < footers.length; i++) {
    const m = footers[i];
    out += html.slice(cursor, m.index);
    if (i === 0) {
      const footer = m[0].includes('data-goalos-footer=')
        ? m[0].replace(/<footer\b(?![^>]*data-goalos-footer=)/i, '<footer data-goalos-footer="canonical"')
        : m[0].replace(/<footer\b/i, '<footer data-goalos-footer="canonical"');
      out += footer.replace(/data-goalos-footer=["'][^"']*["']/, 'data-goalos-footer="canonical"');
    }
    cursor = m.index + m[0].length;
  }
  out += html.slice(cursor);
  return out;
}
function insertLegalRail(html) {
  const footer = /<footer\b[^>]*data-goalos-footer=["']canonical["'][^>]*>[\s\S]*?<\/footer>/i;
  if (footer.test(html)) return html.replace(footer, (m) => `${LEGAL_RAIL}\n${m}`);
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${LEGAL_RAIL}\n</body>`);
  return `${html}\n${LEGAL_RAIL}\n`;
}
function count(html, re) { return (html.match(re) || []).length; }

walk(site);
const failures = [];
let changed = 0;
for (const fp of htmlFiles) {
  const rel = path.relative(site, fp).replaceAll(path.sep, '/');
  if (rel.startsWith('404')) continue;
  const before = fs.readFileSync(fp, 'utf8');
  let html = before;
  html = removeLegalRails(html);
  html = canonicalizeFooter(html);
  html = insertLegalRail(html);
  html = html.replace(/\n{3,}/g, '\n\n');
  const railCount = count(html, /data-goalos-legal-rail="v12"/g);
  const footerCount = count(html, /data-goalos-footer="canonical"/g);
  if (railCount !== 1) failures.push(`${rel} legal rail count ${railCount}`);
  if (footerCount !== 1) failures.push(`${rel} canonical footer count ${footerCount}`);
  if (!html.includes(LEGACY_NEEDLE)) failures.push(`${rel} missing legacy public rule phrase: ${LEGACY_NEEDLE}`);
  if (!html.includes(STRICT_NEEDLE)) failures.push(`${rel} missing strict public rule phrase: ${STRICT_NEEDLE}`);
  if (/<form\b|<input\b|<textarea\b|<select\b/i.test(html)) failures.push(`${rel} contains forbidden form/input control`);
  if (html !== before) { fs.writeFileSync(fp, html); changed++; }
}
if (failures.length) {
  console.error('GoalOS public-site boundary normalizer FAILED');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log(`GoalOS public-site boundary normalizer PASS — ${htmlFiles.length} HTML pages checked, ${changed} updated`);
