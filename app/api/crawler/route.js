import OpenAI from 'openai';
import Parser from 'rss-parser';

export async function GET() {
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  const parser = new Parser();

  try {
    const feed = await parser.parseURL('https://www.producthunt.com/feed?format=rss');
    const topItems = feed.items.slice(0, 10);
    const newsText = topItems.map((item, i) => `${i+1}. ${item.title}`).join('\n');

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是一个顶尖的AI营销与变现分析师。请用中文分析以下Product Hunt最新产品，筛选出最有商业变现潜力的AI工具或方向。返回JSON格式：{\"opportunities\":[{\"product\":\"产品名\",\"why\":\"商业潜力\",\"action\":\"怎么跟进变现\"}]}"
        },
        {
          role: "user",
          content: `今日Product Hunt热门产品：\n${newsText}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    return new Response(JSON.stringify({
      success: true,
      source: 'Product Hunt',
      fetchedAt: new Date().toISOString(),
      productCount: topItems.length,
      analysis: result
    }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }
}
