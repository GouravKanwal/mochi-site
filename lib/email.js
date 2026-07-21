// Sends email via Resend (https://resend.com). If no API key is configured we
// fall back to logging — so local dev works without an email account.

export function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

export async function sendMail({ to, subject, html }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Mochi <onboarding@resend.dev>';

  if (!key) {
    // Dev fallback: no email provider configured.
    console.warn('[email] RESEND_API_KEY not set — would have sent to', to, '\n', subject, '\n', html);
    return { dev: true };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Resend send failed: ${res.status} ${text}`);
  }
  return res.json();
}
