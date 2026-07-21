import { NextResponse } from 'next/server';
import { verify } from '@/lib/token';

export const runtime = 'nodejs';

export async function GET(req) {
  const payload = verify(req.cookies.get('mochi_dl')?.value);
  if (!payload) {
    return NextResponse.redirect(new URL('/?e=verify', req.url));
  }
  const url = process.env.DOWNLOAD_URL;
  if (!url) {
    return NextResponse.json({ error: 'Download is not configured yet.' }, { status: 500 });
  }
  return NextResponse.redirect(url);
}
