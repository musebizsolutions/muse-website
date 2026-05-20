export async function onRequestPost({ request, env }) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return Response.json({ ok: false }, { status: 400 });
    }

    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (res.status === 201 || res.status === 204) return Response.json({ ok: true });
    const body = await res.json().catch(() => ({}));
    // duplicate_parameter = already subscribed, treat as success
    if (body.code === 'duplicate_parameter') return Response.json({ ok: true });
    return Response.json({ ok: false }, { status: 502 });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
