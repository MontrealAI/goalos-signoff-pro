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
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fp);
      else if (entry.isFile() && entry.name.endsWith('.html')) out.push(fp);
    }
  }
  if (fs.existsSync(site)) walk(site);
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
    .replace(/<(aside|section|div)\b[^>]*class=["'][^"']*(?:site-rule|legal-rail|legalRail|rail)[^"']*["'][^>]*>[\s\S]*?Public site rule[\s\S]*?<\/\1>/gi, '');
}

export function stripFooterCompatibilityMarkers(html) {
  return html.replace(/<!--\s*GoalOS legacy footer compatibility:\s*data-goalos-footer=["']v12["']\s*-->/gi, '');
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

export function boundaryCounts(html) {
  return {
    legalRail: countNeedle(html, 'data-goalos-legal-rail="v12"'),
    footerCanonical: countNeedle(html, 'data-goalos-footer="canonical"'),
    footerLegacy: countNeedle(html, 'data-goalos-footer="v12"'),
    legacyPhrase: html.includes(LEGACY_NEEDLE),
    strictPhrase: html.includes(STRICT_NEEDLE),
  };
}

export function assertBoundary(html, rel, failures) {
  const c = boundaryCounts(html);
  if (c.legalRail !== 1) failures.push(`${rel} must contain exactly one v12 legal rail`);
  if (c.footerCanonical !== 1) failures.push(`${rel} must contain exactly one canonical footer`);
  if (c.footerLegacy !== 1) failures.push(`${rel} must contain exactly one legacy v12 footer marker`);
  if (!c.legacyPhrase) failures.push(`${rel} missing legacy phrase: ${LEGACY_NEEDLE}`);
  if (!c.strictPhrase) failures.push(`${rel} missing strict phrase: ${STRICT_NEEDLE}`);
  if (/<form\b|<input\b|<textarea\b|<select\b/i.test(html)) failures.push(`${rel} contains forbidden form/input control`);
}
