export async function GET(request) {
  const webhookUrl = process.env.FEISHU_WEBHOOK_URL;
  
  const baseUrl = request.nextUrl.origin;
  
  const crawlerRes = await fetch(`${baseUrl}/api/crawler`);
  const crawlerData = await crawlerRes.json();
  
  if (!crawlerData.success) {
    return Response.json({ success: false, error: '爬虫抓取失败' }, { status: 500 });
  }

  const opportunities = crawlerData.analysis.opportunities || [];
  const top5 = opportunities.slice(0, 5);
  
  const message = {
    msg_type: "interactive",
    card: {
      header: {
        title: { tag: "plain_text", content: "🤖 今日AI商机快报" },
        template: "blue"
      },
      elements: [
        {
          tag: "div",
          text: { 
            tag: "lark_md", 
            content: `📅 抓取时间：${crawlerData.fetchedAt}\n📡 数据来源：${crawlerData.source}\n📊 共分析 ${crawlerData.productCount} 个产品，筛选出 ${top5.length} 个变现机会`
          }
        },
        { tag: "hr" },
        ...top5.map((item, index) => ({
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**${index + 1}. ${item.product || '未知产品'}**\n💡 商机：${item.why || '暂无分析'}\n🎯 行动：${item.action || '暂未提供'}`
          }
        })).flatMap(item => [item, { tag: "hr" }]),
        {
          tag: "note",
          elements: [
            { tag: "plain_text", content: "由 DeepSeek + 多机器人系统自动生成" }
          ]
        }
      ]
    }
  };

  const feishuRes = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });

  const feishuResult = await feishuRes.json();
  
  return Response.json({
    success: true,
    feishuStatus: feishuResult.StatusMessage || 'sent',
    report: crawlerData
  });
}
