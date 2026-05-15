import { NextResponse } from 'next/server';

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>订阅成功 - 独立开发者掘金简报</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: white; border-radius: 20px; padding: 48px 40px; max-width: 480px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
    .emoji { font-size: 64px; margin-bottom: 16px; }
    h1 { font-size: 28px; margin-bottom: 12px; color: #1a1a2e; }
    p { color: #666; line-height: 1.6; margin-bottom: 8px; }
    .highlight { background: #f0f4ff; border-radius: 12px; padding: 16px; margin: 24px 0; text-align: left; }
    .btn { display: inline-block; background: #667eea; color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="emoji">🎉</div>
    <h1>免费订阅成功！</h1>
    <p>明天起，每天上午你会收到一条掘金机会推送。</p>
    <div class="highlight">
      <p>📬 推送渠道：飞书机器人</p>
      <p>⏰ 推送时间：每日早 8:00</p>
      <p>📌 内容：1 条可执行赚钱机会</p>
    </div>
    <p style="font-size: 14px; color: #999;">想解锁每日 5 条 + 完整 SOP？</p>
    <a href="/checkout?plan=standard" class="btn">首月 ¥9.9 体验</a>
  </div>
</body>
</html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export async function POST() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const reportRes = await fetch(`${baseUrl}/api/daily-report`);
    const { report } = await reportRes.json();
    const opps = report.opportunities;

    if (opps.length === 0) {
      return NextResponse.json({ success: true, message: '今天没有推送机会' });
    }

    const webhookUrl = process.env.FEISHU_WEBHOOK_URL;
    if (!webhookUrl) throw new Error('Missing FEISHU_WEBHOOK_URL');

    const freePreview = opps[0];
    const elements = [
      {
        tag: 'div',
        text: { tag: 'lark_md', content: `**🚀 独立开发者掘金简报**\n${new Date().toLocaleDateString('zh-CN')}\n⚠️ 由 AI 自动生成，仅供参考` }
      },
      { tag: 'hr' },
      {
        tag: 'div',
        text: {
          tag: 'lark_md',
          content: `**今日免费机会：${freePreview.title}**\n💡 ${freePreview.idea}\n🎯 ${freePreview.target}\n💰 预估收入：${freePreview.revenue}\n⚡ 难度：${freePreview.difficulty}\n📋 行动：${freePreview.actions.join('；')}`
        }
      },
      { tag: 'hr' },
      {
        tag: 'div',
        text: {
          tag: 'lark_md',
          content: `👉 解锁每日 5 条完整机会 + 执行 SOP\n首月 ¥9.9  [立即订阅](https://canzi-ai.com/checkout?plan=standard)`
        }
      },
      {
        tag: 'note',
        elements: [{ tag: 'plain_text', content: 'AI生成仅供参考 · 付费版附人工筛选 · 退订回复 TD' }]
      }
    ];

    const feishuBody = {
      msg_type: 'interactive',
      card: {
        header: {
          title: { tag: 'plain_text', content: '📬 独立开发者掘金简报' },
          template: 'blue'
        },
        elements
      }
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feishuBody)
    });

    return NextResponse.json({ success: true, message: '推送成功' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
