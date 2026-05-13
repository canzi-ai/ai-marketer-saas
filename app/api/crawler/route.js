import OpenAI from 'openai';
import Parser from 'rss-parser';

export async function GET() {
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  const parser = new Parser();
  const allItems = [];

  // 1. Product Hunt
  try {
    const feed = await parser.parseURL('https://www.producthunt.com/feed?format=rss');
    feed.items.slice(0, 10).forEach(item => {
      allItems.push({ title: item.title, source: 'Product Hunt' });
    });
  } catch (e) {}

  // 2. Hacker News
  try {
    const hnFeed = await parser.parseURL('https://hnrss.org/frontpage?count=10');
    hnFeed.items.forEach(item => {
      allItems.push({ title: item.title, source: 'Hacker News' });
    });
  } catch (e) {}

  // 3. GitHub Trending
  try {
    const ghRes = await fetch('https://api.github.com/search/repositories?q=stars:>100+pushed:>2026-05-10&sort=stars&order=desc&per_page=10', {
      headers: { 'User-Agent': 'ai-marketer-saas' }
    });
    const ghData = await ghRes.json();
    ghData.items?.forEach(item => {
      allItems.push({ title: item.full_name + ' - ' + item.description, source: 'GitHub Trending' });
    });
  } catch (e) {}

  if (allItems.length === 0) {
    return Response.json({ success: false, error: '所有数据源抓取失败' }, { status: 500 });
  }

  const newsText = allItems.map((item, i) => `${i+1}. [${item.source}] ${item.title}`).join('\n');

  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: `你是一个顶尖的AI变现分析师。请从以下内容中，筛选出3个最值得关注的商业信号，并按以下格式深度分析：

返回JSON格式：
{
  "opportunities": [
    {
      "signal": "信号描述（一个具体的项目/新闻/趋势）",
      "why": "为什么重要？分析背后的市场变化、技术突破或需求爆发（50字以上）",
      "action": "具体的变现操作步骤，包括目标用户、定价策略、推广渠道（50字以上）",
      "difficulty": "低/中/高",
      "revenue_potential": "预估月收入潜力",
      "target_users": "目标用户画像",
      "time_window": "这个红利期预计持续多久"
    }
  ]
}

规则：
- 只返回3个机会，宁缺毋滥
- why和action必须具体，不能泛泛而谈
- 优先选择有明确变现路径的信号`
      },
      {
        role: "user",
        content: `今日来自多个平台的热门内容：\n${newsText}`
      }
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(completion.choices[0].message.content);

  return new Response(JSON.stringify({
    success: true,
    sources: ['Product Hunt', 'Hacker News', 'GitHub Trending'],
    totalScanned: allItems.length,
    fetchedAt: new Date().toISOString(),
    analysis: result
  }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
