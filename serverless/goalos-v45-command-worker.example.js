// Optional future live-AI adapter for GoalOS v45.
// Do not deploy this without rate limits, origin allowlisting, route allowlisting,
// abuse monitoring, prompt-injection defenses, privacy disclosure, and secret management.
// The default GitHub Pages implementation is browser-local and makes no external AI call.
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (allowed.length && !allowed.includes(origin)) return new Response('Origin not allowed', { status: 403 });
    const body = await request.json().catch(() => ({}));
    const question = String(body.question || '').slice(0, 1000);
    return Response.json({
      mode: 'example_stub',
      question,
      answer: 'Server-side live mode is intentionally disabled in this example. Use the browser-local router unless an authorized endpoint is deployed.',
      route: 'goalos-universal-command-center.html'
    }, { headers: { 'Access-Control-Allow-Origin': origin || '*' } });
  }
};
