import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const siteDir = path.join(root, process.env.GOALOS_SITE_DIR || 'site');
const routes = ['independent-replay-lab.html','replay-council-lab.html','claim-promotion-lab.html'];
const artifacts = ['independent-replay-demo-bundle.json','replay-operator-reports.json','claim-promotion-certificate.json','public-evidence-review-card.json','reproduction-manifest.json','independent-replay-manifest.json'];
const fail = (msg) => { console.error(`Independent Replay Lab gate FAILED\n- ${msg}`); process.exit(1); };
const exists = async p => !!(await fs.stat(p).catch(() => false));
for (const r of routes) {
  const p = path.join(siteDir, r);
  if (!(await exists(p))) fail(`${r} missing`);
  const html = await fs.readFile(p, 'utf8');
  if (html.includes('Route Not Found')) fail(`${r} fell back to Route Not Found`);
  for (const tag of ['<form','<input','<textarea','<select']) if (html.toLowerCase().includes(tag)) fail(`${r} contains disallowed ${tag}`);
  for (const bad of ['localStorage','sessionStorage','document.cookie','connect wallet','mailto:','contact@montreal.ai','guaranteed return','guaranteed profit','guaranteed yield']) if (html.toLowerCase().includes(bad.toLowerCase())) fail(`${r} contains blocked phrase or API: ${bad}`);
  const rails = [...html.matchAll(/data-goalos-legal-rail="v12"/g)].length;
  const footers = [...html.matchAll(/data-goalos-footer="v12"/g)].length;
  if (rails !== 1) fail(`${r} must contain exactly one canonical v12 legal rail; found ${rails}`);
  if (footers !== 1) fail(`${r} must contain exactly one canonical footer; found ${footers}`);
  for (const phrase of ['One run is not proof','Replay makes it public','No replay quorum, no claim promotion','Run replay council','ClaimPromotionCertificate']) {
    if (!html.includes(phrase)) fail(`${r} missing required phrase: ${phrase}`);
  }
}
for (const a of artifacts) {
  const p = path.join(siteDir, a);
  if (!(await exists(p))) fail(`${a} missing`);
  const json = JSON.parse(await fs.readFile(p, 'utf8'));
  if (JSON.stringify(json).toLowerCase().includes('guaranteed return')) fail(`${a} contains unsupported phrase`);
}
const bundle = JSON.parse(await fs.readFile(path.join(siteDir, 'independent-replay-demo-bundle.json'), 'utf8'));
if (!bundle.candidates?.some(c => c.id === 'C3' && c.verdict === 'PROMOTE_FOR_REVIEW')) fail('C3 promoted candidate missing');
if (bundle.valueMoved !== 0) fail('demo bundle must move zero value');
const ops = JSON.parse(await fs.readFile(path.join(siteDir, 'replay-operator-reports.json'), 'utf8'));
if (ops.operators?.length !== 3 || ops.focusedTests !== 318) fail('replay operator reports missing 3 operators / 318 tests');
console.log('GoalOS Independent Replay & Claim Promotion Lab v24 gate PASS');
