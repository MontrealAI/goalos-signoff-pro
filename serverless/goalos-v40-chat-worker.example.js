// GoalOS Signoff Pro v40 — optional server-side live AI endpoint adapter
// This is intentionally NOT used by the GitHub Pages site by default.
// Deploy only behind your own domain, rate limits, origin allowlist, and secret management.
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
    const origin = request.headers.get('origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (allowed.length && !allowed.includes(origin)) return new Response('Forbidden origin', { status: 403 });
    let body;
    try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
    const question = String(body.question || '').slice(0, 800);
    const localCandidate = body.localCandidate || {};
    const allowlist = Array.isArray(body.allowlist) ? body.allowlist : [];
    if (!question || /0x[a-f0-9]{64}|seed phrase|private key|password/i.test(question)) {
      return Response.json({ answer: 'Please do not enter secrets, wallet data, personal data, or payment information. Use the local GoalOS route map instead.', route: 'ask-goalos-live.html', confidence: 1, safety: 'blocked-secret-like-input' });
    }
    // Replace this block with your authorized provider call.
    // Never expose provider secrets in browser JavaScript.
    const route = allowlist.includes(localCandidate.route) ? localCandidate.route : 'goalos-v22-v40-command-center.html';
    return Response.json({
      answer: localCandidate.answer || 'Open the recommended GoalOS page for the best next step.',
      route,
      confidence: 0.72,
      citations: [route],
      safety: 'server-adapter-template-no-provider-call'
    });
  }
};
