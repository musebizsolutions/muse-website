export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json' };

  let email;
  try {
    ({ email } = await request.json());
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid json' }), { status: 400, headers });
  }

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid email' }), { status: 400, headers });
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (res.status === 201 || res.status === 204) {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    const body = await res.json().catch(() => ({}));
    // duplicate_parameter = already subscribed, still a success
    if (body.code === 'duplicate_parameter') {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ ok: false, brevo: res.status }), { status: 502, headers });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers });
  }
}
