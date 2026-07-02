// Optional future server-side live-AI endpoint adapter for v47.
// Do not expose model-provider API keys in browser JavaScript.
// Add origin allowlists, rate limits, moderation, route allowlists, and logging controls before use.
export default {
  async fetch(request) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
    return Response.json({
      mode: 'example-only',
      message: 'v47 public site is browser-local by default. Deploy a reviewed server endpoint before enabling live AI.',
      allowed: false
    });
  }
};
