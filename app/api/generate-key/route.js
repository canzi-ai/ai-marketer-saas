import { NextResponse } from 'next/server';

function randStr(len) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let r = '';
  for (let i = 0; i < len; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

function hmac(secret, msg) {
  let h = 0;
  const s = secret + msg;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return Math.abs(h).toString(36).padStart(8, '0');
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('pwd') !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const secret = process.env.ACTIVATION_SECRET || 'default-secret';
  const prefix = randStr(8);
  const key = prefix + hmac(secret, prefix + 'pro');
  return NextResponse.json({ key });
}
