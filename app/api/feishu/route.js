import { NextResponse } from 'next/server';

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
        text: { tag: 'lark_md', content: `**🚀 独立开发者掘金简报**\n${new Date().toLocaleDateString('zh-CN')}` }
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
          content: `👉 解锁每日 5 条完整机会 + 执行 SOP\n仅 ¥99/月  [立即订阅](https://canzi-ai.com/pricing)`
        }
      },
      {
        tag: 'note',
        elements: [{ tag: 'plain_text', content: '退订请回复 TD' }]
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
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(feishuBody)
    });

    return NextResponse.json({ success: true, message: '推送成功' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
