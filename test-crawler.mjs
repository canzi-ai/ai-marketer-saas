import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const sampleNews = [
  "OpenAI 发布 GPT-5，性能大幅提升，API 价格降低 50%",
  "TikTok Shop 跨境电商2026年Q1 GMV 同比增长 120%",
  "Google 推出 AI 广告创作工具，支持自动生成视频广告",
  "Stripe 推出 AI 驱动的智能收费系统，可根据用户行为动态调整价格",
  "Anthropic 获得 50 亿美元融资，将推出企业级 AI 代理服务"
];

const completion = await openai.chat.completions.create({
  model: "deepseek-chat",
  messages: [
    {
      role: "system",
      content: "你是一个顶尖的AI营销与变现分析师。请用中文分析以下新闻，找出最有价值的AI营销与变现机会。返回JSON格式：{\"opportunities\": [{\"title\": \"机会标题\", \"summary\": \"为什么是机会\", \"action\": \"具体可操作步骤\"}]}"
    },
    {
      role: "user",
      content: `今日AI商业新闻：\n${sampleNews.map((n, i) => `${i+1}. ${n}`).join('\n')}`
    }
  ],
  response_format: { type: "json_object" },
});

const result = JSON.parse(completion.choices[0].message.content);
console.log(JSON.stringify(result, null, 2));
