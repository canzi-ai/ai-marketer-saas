export async function GET(request) {
  const webhookUrl = process.env.FEISHU_WEBHOOK_URL;
  const baseUrl = request.nextUrl.origin;
  
  const crawlerRes = await fetch(`${baseUrl}/api/crawler`);
  const crawlerData = await crawlerRes.json();
  
  if (!crawlerData.success) {
    return Response.json({ success: false, error: '爬虫抓取失败' }, { status: 500 });
  }

  const opportunities = crawlerData.analysis.opportunities || [];
  
  const url = new URL(request.url);
  const isPaid = url.searchParams.get('paid') === 'true';
  const topItems = isPaid ? opportunities.slice(0, 5) : opportunities.slice(0, 1);
  
  const now = new Date();
  const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const timeStr = beijingTime.toISOString().replace('T', ' ').substring(0, 19);
  
  const message = {
    msg_type: "interactive",
    card: {
      header: {
        title: { tag: "plain_text", content: isPaid ? `🤖 AI商机日报 · 深度版 (${timeStr})` : `🤖 AI商机速览 (${timeStr})` },
        template: isPaid ? "purple" : "blue"
      },
      elements: [
        {
          tag: "div",
          text: { 
            tag: "lark_md", 
            content: `📡 多源扫描：Product Hunt / Hacker News / GitHub Trending\n📊 扫描 ${crawlerData.totalScanned} 条信号，精选 ${topItems.length} 个机会`
          }
        },
        { tag: "hr" },
        ...topItems.flatMap((item, index) => [
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**${index + 1}. ${item.signal || '新信号'}**\n` +
                       `🏷️ 来源：${item.source || '综合'}\n` +
                       `📈 潜力：${item.revenue_potential || '待评估'} | 难度：${item.difficulty || '中'}\n` +
                       `🎯 用户：${item.target_users || '待分析'}\n` +
                       `💡 洞察：${item.why || '暂无深度分析'}\n` +
                       `⚡ 行动：${item.action || '暂未提供'}\n` +
                       `⏰ 窗口期：${item.time_window || '未知'}`
            }
          },
          { tag: "hr" }
        ]),
        ...(isPaid ? [{
          tag: "note",
          elements: [{ tag: "plain_text", content: "由 DeepSeek 多智能体系统自动生成" }]
        }] : [{
          tag: "div",
          text: {
            tag: "lark_md",
            content: "🔒 **想看完整 5 个机会 + 深度分析？**\n[👉 点击订阅付费版](https://canzi-ai.com/pricing)"
          }
        }])
      ]
    }
  };

  const feishuRes = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });

  const feishuResult = await feishuRes.json();
  
  return Response.json({ success: true, isPaid, itemsCount: topItems.length, feishuStatus: feishuResult.StatusMessage || 'sent' });
}
