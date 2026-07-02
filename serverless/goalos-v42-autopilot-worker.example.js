// Optional future live-AI adapter for GoalOS Autopilot Studio v42.
// Do not put provider API keys in browser JavaScript.
// Deploy only as a server-side endpoint with rate limits, origin allowlist,
// prompt-injection controls, same-site route allowlist, and privacy disclosures.
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.GOALOS_ALLOWED_ORIGINS || '').split(',').map(x => x.trim()).filter(Boolean);
    if (allowed.length && !allowed.includes(origin)) return new Response('Forbidden', { status: 403 });
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    const body = await request.json().catch(() => null);
    const intent = String(body?.intent || '').slice(0, 4000);
    if (!intent) return Response.json({ error: 'Missing intent' }, { status: 400 });
    return Response.json({
      mode: 'example_only',
      answer: 'Server-side live AI endpoint placeholder. Keep default browser-local routing until this endpoint is secured and authorized.',
      route: 'goalos-autopilot-studio.html',
      boundary: ['no wallet', 'no payment', 'no value moved', 'route allowlist required']
    });
  }
};
