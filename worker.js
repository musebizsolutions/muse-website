export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/subscribe' && request.method === 'POST') {
      try {
        const { email } = await request.json();
        if (!email || !email.includes('@')) return json({ ok: false }, 400);

        const res = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'api-key': env.BREVO_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email })
        });

        if (res.status === 201 || res.status === 204) return json({ ok: true });
        const body = await res.json().catch(() => ({}));
        // "duplicate_parameter" = already subscribed — treat as success
        if (body.code === 'duplicate_parameter') return json({ ok: true });
        return json({ ok: false }, 502);
      } catch {
        return json({ ok: false }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
