/**
 * GoalOS v41 optional live-AI Autopilot endpoint example.
 * Do not deploy with a browser-exposed API key. Keep provider secrets server-side.
 * This worker is intentionally provider-neutral. Replace callModel() with your approved model gateway.
 */
const ALLOWED_ORIGINS = new Set(['https://montrealai.github.io']);
const ALLOWED_ROUTES = new Set(['goalos-autopilot.html','ai-research-strategy-signoff-console.html','agialpha-48-contract-atlas.html','proof-before-settlement-research-lab.html','loop-rsi-asi-superintelligence-mission-simulator-lab.html','mission-001.html','verify.html','public-demo-labs.html']);
function json(body, status=200, origin='*'){return new Response(JSON.stringify(body,null,2),{status,headers:{'content-type':'application/json','access-control-allow-origin':origin,'cache-control':'no-store'}})}
export default { async fetch(request, env) {
  const origin = request.headers.get('origin') || '';
  if (!ALLOWED_ORIGINS.has(origin)) return json({error:'origin_not_allowed'},403,'null');
  if (request.method === 'OPTIONS') return new Response(null,{headers:{'access-control-allow-origin':origin,'access-control-allow-methods':'POST,OPTIONS','access-control-allow-headers':'content-type'}});
  if (request.method !== 'POST') return json({error:'method_not_allowed'},405,origin);
  const body = await request.json().catch(()=>null);
  const text = String(body?.question || '').slice(0,2000);
  if (!text.trim()) return json({error:'empty_question'},400,origin);
  // Add rate limiting, moderation, abuse detection, and audit-safe logging before production.
  const answer = await callModel(text, env);
  const route = ALLOWED_ROUTES.has(answer.route) ? answer.route : 'goalos-autopilot.html';
  return json({answer: answer.text, route, confidence: answer.confidence || 0.72, policy:'same-site route allowlist enforced'},200,origin);
}};
async function callModel(text, env){
  return { text: 'GoalOS interpreted your request and selected a safe same-site route. Configure an approved model gateway here for true live-AI mode.', route: 'goalos-autopilot.html', confidence: 0.72 };
}
