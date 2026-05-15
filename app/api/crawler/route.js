import axios from 'axios';
import * as cheerio from 'cheerio';

const SOURCES = [
  { name: '机器之心', url: 'https://www.jiqizhixin.com/rss', type: 'rss' },
];

async function analyzeWithDeepSeek(rawText) {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  const systemPrompt = `你是一名专业的独立开发者业务分析师。你的任务是从给定的行业资讯中，**只**提取出可独立执行、低投入、高潜力的赚钱机会。忽略所有纯新闻、纯技术、纯资本事件的摘要。为每个机会提供：

- 机会标题（10字以内，直击痛点）
- 落地思路（2-3句话，说明如何转化为产品/服务）
- 目标客户（1句话）
- 预估启动成本（时间+金钱）
- 预估月收入潜力（区间）
- 难度等级（低/中/高）
- 行动清单（3个具体下一步动作）

**输出格式**：严格 JSON 数组，不要任何额外解说，不要 markdown，不要代码块标记。每个元素包含字段：title, idea, target, cost, revenue, difficulty, actions (数组)。
如果没有合适机会，返回空数组 []。

内容如下：###`;

  const response = await axios.post(
    `${DEEPSEEK_BASE_URL}/chat/completions`,
    {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: rawText.substring(0, 8000) },
      ],
      temperature: 0.4,
      max_tokens: 2048,
    },
    { headers: { Authorization: `Bearer ${DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json; charset=utf-8' } }
  );

  const content = response.data.choices[0].message.content;
  const cleanJson = content.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error('解析失败，原始输出：', content);
    return [];
  }
}

export async function GET(request) {
  try {
    const results = [];
    for (const src of SOURCES) {
      if (src.type === 'rss') {
        const { data } = await axios.get(src.url, { timeout: 10000 });
        const $ = cheerio.load(data, { xmlMode: true });
        let texts = [];
        $('item').each((i, el) => {
          const text = $(el).find('description').text() || $(el).find('title').text();
          texts.push(text);
        });
        const combined = texts.slice(0, 10).join('\n');
        const opportunities = await analyzeWithDeepSeek(combined);
        results.push({ source: src.name, opportunities });
      }
    }

    return new Response(JSON.stringify({ success: true, data: results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (error) {
    console.error('Crawler error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}
