import { NextResponse } from 'next/server';
import { sign } from '@/lib/token';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  const { name = '', email = '', consent = false } = body;

  if (!consent) {
    return NextResponse.json({ error: 'Please agree to the privacy note first.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  // Save the lead to Google Sheets (best-effort — never block the download on it).
  const hook = process.env.GOOGLE_SHEET_WEBHOOK;
  if (hook) {
    try {
      await fetch(hook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ts: new Date().toISOString(),
          name: String(name).slice(0, 120),
          email: email.toLowerCase().slice(0, 160),
          ua: req.headers.get('user-agent') || '',
        }),
      });
    } catch (e) {
      console.error('Sheet append failed:', e);
    }
  }

  // Grant a short-lived download cookie so /api/download works right after.
  const dl = sign({ email: email.toLowerCase(), exp: Date.now() + 15 * 60 * 1000 });
  const res = NextResponse.json({ ok: true, download: '/api/download' });
  res.cookies.set('mochi_dl', dl, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 900,
    path: '/',
  });
  return res;
}
