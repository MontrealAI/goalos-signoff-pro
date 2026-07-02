// Optional future live-AI adapter. Do not deploy with browser-exposed API keys.
// Required production controls: server-side secret management, rate limits, origin allowlist,
// same-site route allowlist, privacy notice, and prompt-injection hardening.
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
    return Response.json({
      mode: 'disabled_example',
      message: 'Default GoalOS v43 runs browser-local. Configure a server-side model provider before enabling live AI.'
    });
  }
};
