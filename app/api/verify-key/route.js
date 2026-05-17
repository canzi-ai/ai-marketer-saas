import { NextResponse } from 'next/server';

function hmac(secret, msg) {
  let h = 0;
  const s = secret + msg;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return Math.abs(h).toString(36).padStart(8, '0');
}

export async function POST(request) {
  try {
    const { key } = await request.json();
    if (!key || key.length < 16) return NextResponse.json({ valid: false });
    const secret = process.env.ACTIVATION_SECRET || 'default-secret';
    const prefix = key.substring(0, 8);
    const expected = hmac(secret, prefix + 'pro');
    return NextResponse.json({ valid: key === prefix + expected });
  } catch {
    return NextResponse.json({ valid: false });
  }
}
