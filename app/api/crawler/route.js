import axios from 'axios';
import * as cheerio from 'cheerio';

const SOURCES = [
  { name: '机器之心', url: 'https://www.jiqizhixin.com/rss', type: 'rss' },
];

async function callAI(rawText, retries = 2) {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  const systemPrompt = `你是一位年入百万的独立开发者导师。从以下资讯中提取 8 条可立即执行的赚钱机会。每条必须详尽，让读者读完就能动手。

每条机会需包含以下字段（全部必填，不得省略）：

- title: 机会标题（10字内，含具体数字更佳，如"3天搭建AI客服月入2万"）
- idea: 落地思路（4-5句话，说明：这个需求为什么存在、技术方案、为什么现在能做、优势在哪、如何避坑）
- target: 目标客户（具体到行业+规模+特征，如"年营收100-500万、客服人员≥3人的淘宝/抖音电商卖家"）
- cost: 启动成本（时间精确到天、金钱精确到元，含明细如"API费约800元/月+服务器200元/月"）
- revenue: 月收入潜力（给三个档次：保守/乐观/爆发，每档带数字，如"保守¥3,000/乐观¥8,000/爆发¥20,000"）
- difficulty: 难度（低/中/高 + 一句话解释为什么，如"中 · 需基础Python能力但无需机器学习经验"）
- actions: 行动清单（5步，每步1句话，具体的工具名、平台名、方法）
- sop: 执行SOP（分3天写：Day1做什么、Day3做什么、Day7做什么，每步带可验证的完成标准）
- tools: 推荐工具栈（3-5个具体工具/平台/API名称，附一句话用途说明）
- pitfall: 常见坑（1-2个新手最容易踩的坑及避坑方法）

输出纯JSON数组，不要markdown标记，不要额外文字。无合适机会返回 []。

内容如下：###`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        `${DEEPSEEK_BASE_URL}/chat/completions`,
        {
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: rawText.substring(0, 12000) },
          ],
          temperature: 0.5,
          max_tokens: 8192,
        },
        {
          headers: { Authorization: `Bearer ${DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' },
          timeout: 30000,
        }
      );
      const content = response.data.choices[0].message.content;
      const cleanJson = content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error(`AI调用失败 (第${attempt}次):`, e.message);
      if (attempt < retries) {
        console.log(`等待2秒后重试...`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }
  console.error('AI调用全部重试失败，返回空数组');
  return [];
}

async function analyzeWithAI(rawText) {
  return callAI(rawText);
}


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
        const opportunities = await analyzeWithAI(combined);
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
