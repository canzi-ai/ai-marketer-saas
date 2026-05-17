import { NextResponse } from 'next/server';

const FREE_LIMIT = 5;
const ipMap = new Map();

function getIP(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function POST(request) {
  try {
    const { text, mode } = await request.json();
    if (!text || text.length < 20) {
      return NextResponse.json({ success: false, error: 'Content too short' }, { status: 400 });
    }

    if (mode !== 'pro') {
      const ip = getIP(request);
      const today = new Date().toDateString();
      const key = `${ip}_${today}`;
      const used = ipMap.get(key) || 0;
      if (used >= FREE_LIMIT) {
        return NextResponse.json({ success: false, error: 'Daily limit reached. Upgrade to Pro.' }, { status: 429 });
      }
      ipMap.set(key, used + 1);
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'AI not configured' }, { status: 500 });
    }

    const aiRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Extract structured insights from webpage content. Return ONLY valid JSON: {"title":"...","summary":"...","keyPoints":["...","..."],"entities":[{"name":"...","type":"..."}],"actionable":"..."}. No markdown.' },
          { role: 'user', content: text.substring(0, 5000) }
        ],
        temperature: 0.3,
        max_tokens: 800
      })
    });

    if (!aiRes.ok) throw new Error('AI unavailable');
    const aiData = await aiRes.json();
    const raw = aiData.choices[0].message.content.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);

    return NextResponse.json({ success: true, data: parsed }, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
