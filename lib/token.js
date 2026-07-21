import crypto from 'crypto';

// Stateless, HMAC-signed tokens stored in httpOnly cookies. No database needed:
// the one-time code is never stored in plaintext — only an HMAC of it travels
// in the signed cookie, so the client can't read the code back out.

const SECRET = process.env.OTP_SECRET || 'dev-insecure-secret-change-me';

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

export function hmac(value) {
  return crypto.createHmac('sha256', SECRET).update(String(value)).digest('base64url');
}

export function sign(payload) {
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verify(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  } catch {
    return null;
  }
  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
}

// Constant-time comparison of two HMAC strings.
export function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}
