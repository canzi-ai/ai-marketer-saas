import axios from 'axios';
import * as cheerio from 'cheerio';

const SOURCES = [
  { name: '机器之心', url: 'https://www.jiqizhixin.com/rss', type: 'rss' },
];

async function analyzeWithDeepSeek(rawText) {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  const systemPrompt = `你是独立开发者业务分析师。从资讯中提取 8 条可执行赚钱机会。每条包含：
- title: 机会标题（10字内）
- idea: 落地思路（2-3句）
- target: 目标客户
- cost: 启动成本（时间+金钱）
- revenue: 月收入潜力
- difficulty: 难度（低/中/高）
- actions: 行动清单（3步）
- sop: 执行SOP（3句话：第一步做什么、第二步怎么做、第三步如何获客）

输出纯JSON数组，不要markdown标记，不要额外文字。没有机会返回[]。内容：###`;

  const response = await axios.post(
    `${DEEPSEEK_BASE_URL}/chat/completions`,
    {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: rawText.substring(0, 12000) },
      ],
      temperature: 0.5,
      max_tokens: 4096,
    },
    { headers: { Authorization: `Bearer ${DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' } }
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
        const combined = texts.slice(0, 15).join('\n');
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
