import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  const { name = '', email = '', message = '' } = body;

  if (!message || String(message).trim().length < 3) {
    return NextResponse.json({ error: 'Please write a suggestion first.' }, { status: 400 });
  }

  const hook = process.env.GOOGLE_SHEET_WEBHOOK;
  if (hook) {
    try {
      const r = await fetch(hook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'suggestion',
          ts: new Date().toISOString(),
          name: String(name).slice(0, 120),
          email: String(email).slice(0, 160),
          message: String(message).slice(0, 2000),
        }),
      });
      if (!r.ok) throw new Error('sheet ' + r.status);
    } catch (e) {
      console.error('Suggestion save failed:', e);
      return NextResponse.json({ error: 'Could not send it right now. Try again shortly.' }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true });
}
