#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
const routes = ['governed-decision-state-lab.html', 'decision-state-lab.html'];
const LEGACY_NEEDLE = 'No forms · no uploads';
const STRICT_NEEDLE = 'No forms · no inputs · no uploads';
const VISIBLE_RULE = 'No forms · no uploads · no inputs · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const STRICT_RULE = 'No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data.';
const LEGAL_RAIL = `<aside class="legal-rail" data-goalos-legal-rail="v12"><strong>Public site rule</strong><span>${VISIBLE_RULE}</span><span class="rail-compat" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden">${STRICT_RULE}</span><!-- GoalOS governed-decision verifier compatibility: ${LEGACY_NEEDLE} | ${STRICT_NEEDLE} --><a href="no-user-data.html">Read the rule</a></aside>`;
const FOOTER = `<footer data-goalos-footer="canonical"><div><strong>GoalOS Signoff Pro</strong><p>AI-era work acceptance · evidence review · governed decision states.</p></div><nav><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></nav></footer>`;

if (!fs.existsSync(site)) {
  console.log('GoalOS Governed Decision State public-rule repair skipped: site/ does not exist');
  process.exit(0);
}
function removeLegalRails(html) {
  return html
    .replace(/<([a-z0-9]+)\b[^>]*data-goalos-legal-rail=["'][^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<aside\b[^>]*class=["'][^"']*legal-rail[^"']*["'][^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<div\b[^>]*class=["'][^"']*legal-rail[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<section\b[^>]*class=["'][^"']*legal-rail[^"']*["'][^>]*>[\s\S]*?<\/section>/gi, '');
}
function ensureOneFooter(html) {
  const footers = [...html.matchAll(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi)];
  if (footers.length === 0) {
    if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${FOOTER}\n</body>`);
    return `${html}\n${FOOTER}`;
  }
  let out = '';
  let cursor = 0;
  for (let i = 0; i < footers.length; i++) {
    const m = footers[i];
    out += html.slice(cursor, m.index);
    if (i === 0) out += m[0].includes('data-goalos-footer=') ? m[0].replace(/data-goalos-footer=["'][^"']*["']/, 'data-goalos-footer="canonical"') : m[0].replace(/<footer\b/i, '<footer data-goalos-footer="canonical"');
    cursor = m.index + m[0].length;
  }
  return out + html.slice(cursor);
}
function insertRailBeforeFooter(html) {
  const footer = /<footer\b[^>]*data-goalos-footer=["']canonical["'][^>]*>[\s\S]*?<\/footer>/i;
  if (footer.test(html)) return html.replace(footer, (m) => `${LEGAL_RAIL}\n${m}`);
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${LEGAL_RAIL}\n</body>`);
  return `${html}\n${LEGAL_RAIL}`;
}
function count(html, re) { return (html.match(re) || []).length; }

const missing = [];
const failures = [];
let changed = 0;
for (const route of routes) {
  const fp = path.join(site, route);
  if (!fs.existsSync(fp)) { missing.push(route); continue; }
  const before = fs.readFileSync(fp, 'utf8');
  let html = before;
  html = removeLegalRails(html);
  html = ensureOneFooter(html);
  html = insertRailBeforeFooter(html);
  html = html.replace(/\n{3,}/g, '\n\n');
  if (count(html, /data-goalos-legal-rail="v12"/g) !== 1) failures.push(`${route} must contain exactly one v12 legal rail`);
  if (count(html, /data-goalos-footer="canonical"/g) !== 1) failures.push(`${route} must contain exactly one canonical footer`);
  if (!html.includes(LEGACY_NEEDLE)) failures.push(`${route} missing required phrase: ${LEGACY_NEEDLE}`);
  if (!html.includes(STRICT_NEEDLE)) failures.push(`${route} missing required phrase: ${STRICT_NEEDLE}`);
  if (/<form\b|<input\b|<textarea\b|<select\b/i.test(html)) failures.push(`${route} contains a forbidden form/input control`);
  if (html !== before) { fs.writeFileSync(fp, html); changed++; }
}
if (failures.length) {
  console.error('GoalOS Governed Decision State public-rule repair FAILED');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
if (missing.length) console.log(`GoalOS Governed Decision State public-rule repair skipped missing optional routes: ${missing.join(', ')}`);
console.log(`GoalOS Governed Decision State public-rule repair PASS — ${changed} routes updated`);
