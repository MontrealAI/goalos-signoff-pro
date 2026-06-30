import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const siteDir = path.join(process.cwd(), process.env.GOALOS_SITE_DIR || 'site');
const routes = ['proofzero-planning-lab.html','evidence-reanalyze-lab.html','latent-work-state-lab.html','bounded-search-lab.html'];
const artifacts = ['proofzero-planning-demo-bundle.json','latent-work-state-report.json','evidence-reanalyze-ledger.json','planning-depth-scoreboard.json','router-policy-update.json','proofzero-planning-manifest.json'];
const fail = m => { console.error(`GoalOS ProofZero Planning Lab gate FAILED\n- ${m}`); process.exit(1); };
for (const route of routes) {
  const p = path.join(siteDir, route);
  const html = await fs.readFile(p, 'utf8').catch(() => fail(`${route} missing`));
  if (html.includes('Route Not Found')) fail(`${route} is a 404 fallback`);
  for (const banned of ['<form','<input','<textarea','<select','localStorage','sessionStorage','document.cookie','connect wallet','mailto:','contact@montreal.ai']) if (html.toLowerCase().includes(banned.toLowerCase())) fail(`${route} contains banned public artifact string: ${banned}`);
  if ((html.match(/data-goalos-legal-rail="v12"/g)||[]).length !== 1) fail(`${route} must contain exactly one canonical v12 legal rail`);
  if ((html.match(/data-goalos-footer="v12"/g)||[]).length !== 1) fail(`${route} must contain exactly one canonical footer`);
  for (const required of ['ProofZero','Evidence Reanalyze','Latent work state','Run bounded work search','No value moved']) if (!html.includes(required)) fail(`${route} missing required content: ${required}`);
  const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1] || '';
  try { new vm.Script(script); } catch (e) { fail(`${route} browser JavaScript syntax error: ${e.message}`); }
}
for (const artifact of artifacts) {
  const raw = await fs.readFile(path.join(siteDir, artifact), 'utf8').catch(() => fail(`${artifact} missing`));
  JSON.parse(raw);
}
const bundle = JSON.parse(await fs.readFile(path.join(siteDir, 'proofzero-planning-demo-bundle.json'),'utf8'));
if (!bundle.posture?.noUserData || !bundle.posture?.noValueMoved) fail('demo bundle missing zero-data/no-value posture');
if (!bundle.candidates?.some(c => c.id === 'B3' && c.status === 'promote')) fail('B3 ProofZero planner promotion missing');
const scoreboard = JSON.parse(await fs.readFile(path.join(siteDir, 'planning-depth-scoreboard.json'),'utf8'));
if (!(scoreboard.depths?.[0]?.proofDebt > scoreboard.depths?.at(-1)?.proofDebt)) fail('proof debt must decrease across planning depths');
console.log('GoalOS ProofZero Planning Lab gate PASS');
