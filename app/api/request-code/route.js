import { NextResponse } from 'next/server';
import { sign, hmac } from '@/lib/token';
import { sendMail, escapeHtml } from '@/lib/email';

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

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const token = sign({
    email: email.toLowerCase(),
    name: String(name).slice(0, 80),
    ch: hmac(code),
    exp: Date.now() + 10 * 60 * 1000,
  });

  let devCode = null;
  try {
    const result = await sendMail({
      to: email,
      subject: 'Your Mochi download code 🐱',
      html: `
        <div style="font-family:system-ui,sans-serif">
          <p>Hi${name ? ' ' + escapeHtml(name) : ''},</p>
          <p>Your Mochi download code is:</p>
          <p style="font-size:30px;font-weight:800;letter-spacing:6px;color:#e8934a">${code}</p>
          <p>It expires in 10 minutes. If you didn't request this, you can ignore it.</p>
        </div>`,
    });
    if (result && result.dev && process.env.NODE_ENV !== 'production') devCode = code;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Could not send the email right now. Try again shortly.' }, { status: 502 });
  }

  const res = NextResponse.json(devCode ? { ok: true, devCode } : { ok: true });
  res.cookies.set('mochi_otp', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });
  return res;
}
