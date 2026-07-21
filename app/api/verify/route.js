import { NextResponse } from 'next/server';
import { sign, verify, hmac, safeEqual } from '@/lib/token';
import { sendMail, escapeHtml } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  const code = String(body.code || '').trim();

  const payload = verify(req.cookies.get('mochi_otp')?.value);
  if (!payload) {
    return NextResponse.json({ error: 'Your code expired. Please request a new one.' }, { status: 400 });
  }
  if (!code || !safeEqual(hmac(code), payload.ch)) {
    return NextResponse.json({ error: 'That code is incorrect.' }, { status: 400 });
  }

  // Capture the lead by emailing the owner. (No database required.)
  const owner = process.env.OWNER_EMAIL;
  if (owner) {
    try {
      await sendMail({
        to: owner,
        subject: 'New Mochi download 🐱',
        html: `<div style="font-family:system-ui,sans-serif">
          <p>Someone just unlocked the Mochi download:</p>
          <p><b>Name:</b> ${escapeHtml(payload.name || '—')}<br/>
          <b>Email:</b> ${escapeHtml(payload.email)}<br/>
          <b>When:</b> ${new Date().toISOString()}</p></div>`,
      });
    } catch (e) {
      console.error('owner notify failed', e);
    }
  }

  const dl = sign({ email: payload.email, exp: Date.now() + 15 * 60 * 1000 });
  const res = NextResponse.json({ ok: true, download: '/api/download' });
  res.cookies.set('mochi_dl', dl, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 900,
    path: '/',
  });
  res.cookies.set('mochi_otp', '', { maxAge: 0, path: '/' });
  return res;
}
