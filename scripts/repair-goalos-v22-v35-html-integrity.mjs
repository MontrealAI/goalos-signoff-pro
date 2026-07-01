#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const site = path.join(root, 'site');
if (!fs.existsSync(site)) {
  console.error('Missing site/ directory. Run the GoalOS site build first.');
  process.exit(1);
}

const LEGAL_RAIL = '<aside class="site-rule" data-goalos-legal-rail="v12"><b>Public site rule</b><span>No forms · no inputs · no uploads · no cookies · no analytics · no wallets · no payments · no personal or confidential data · zero value moved.</span><a href="no-user-data.html">Read the rule</a></aside>';
const FOOTER = `<footer class="footer goalos-universal-footer"><div><b>GoalOS Signoff Pro</b><span>Proof-to-acceptance · public-safe proof labs · browser-local demos.</span></div><nav><a href="index.html">Home</a><a href="goalos-v22-v35-command-center.html">Command Center</a><a href="public-demo-labs.html">All Labs</a><a href="no-user-data.html">No User Data</a><a href="agialpha-token-boundary.html">$AGIALPHA boundary</a></nav>${LEGAL_RAIL}</footer>`;

const htmlFiles = fs.readdirSync(site, { recursive: true }).filter(f => f.endsWith('.html'));
let repaired = 0;

function removeLegalRails(html) {
  let out = html;
  out = out.replace(/<aside\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/aside>/gi, '');
  out = out.replace(/<div\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/div>/gi, '');
  out = out.replace(/<section\b[^>]*data-goalos-legal-rail=["']v12["'][\s\S]*?<\/section>/gi, '');
  return out;
}

function normalizeFooter(html) {
  const footerRe = /<footer\b[\s\S]*?<\/footer>/gi;
  const footers = html.match(footerRe) || [];
  let out = html.replace(footerRe, '');
  const chosenFooter = footers[0] || FOOTER;
  let footer = removeLegalRails(chosenFooter);
  if (!/<footer\b/i.test(footer)) footer = FOOTER;
  if (/<\/footer>/i.test(footer)) footer = footer.replace(/<\/footer>/i, `${LEGAL_RAIL}</footer>`);
  else footer = FOOTER;
  if (/<\/body>/i.test(out)) out = out.replace(/<\/body>/i, `${footer}</body>`);
  else out += footer;
  return out;
}

function ensureHeadAssets(html) {
  let out = html;
  if (/<head[\s>]/i.test(out) && !/goalos-ultimate-v35\.css/.test(out)) {
    out = out.replace(/<\/head>/i, '<link rel="stylesheet" href="assets/goalos-ultimate-v35.css"></head>');
  }
  return out;
}

for (const rel of htmlFiles) {
  const file = path.join(site, rel);
  const before = fs.readFileSync(file, 'utf8');
  let html = before;
  html = html.replace(/<body([^>]*)class="([^"]*)"([^>]*)>/i, (m, a, cls, b) => {
    if (cls.includes('goalos-ultimate-ready')) return m;
    return `<body${a}class="${cls} goalos-ultimate-ready"${b}>`;
  });
  if (!/goalos-ultimate-ready/.test(html)) html = html.replace(/<body(?![^>]*class=)([^>]*)>/i, '<body class="goalos-ultimate-ready"$1>');
  html = removeLegalRails(html);
  html = normalizeFooter(html);
  html = ensureHeadAssets(html);
  if (html !== before) {
    fs.writeFileSync(file, html);
    repaired++;
  }
}

const errors = [];
for (const rel of htmlFiles) {
  const html = fs.readFileSync(path.join(site, rel), 'utf8');
  const rails = (html.match(/data-goalos-legal-rail="v12"/g) || []).length;
  const footers = (html.match(/<footer\b/gi) || []).length;
  if (rails !== 1) errors.push(`${rel}: expected 1 legal rail, found ${rails}`);
  if (footers !== 1) errors.push(`${rel}: expected 1 footer, found ${footers}`);
}
if (errors.length) {
  console.error('GoalOS HTML integrity repair failed:');
  errors.slice(0, 80).forEach(e => console.error(' - ' + e));
  process.exit(1);
}
console.log(`GoalOS v22-v35 HTML integrity repair PASS: ${htmlFiles.length} HTML files checked, ${repaired} repaired.`);
