#!/bin/bash
set -e

echo "🔄 转型为『独立开发者掘金简报』，正在更新代码…"

# 1. 核心爬虫 + 分析 API（输出可执行机会）
cat > app/api/crawler/route.js << 'CRAWLER_EOF'
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
        const combined = texts.slice(0, 10).join('\n');
        const opportunities = await analyzeWithDeepSeek(combined);
        results.push({ source: src.name, opportunities });
      }
    }

    return new Response(JSON.stringify({ success: true, data: results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Crawler error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
CRAWLER_EOF
echo "✅ 爬虫 API 已更新（输出机会清单）"

# 2. 日报 API
mkdir -p app/api/daily-report
cat > app/api/daily-report/route.js << 'DAILY_EOF'
import { NextResponse } from 'next/server';

let lastReport = { timestamp: null, opportunities: [] };

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const crawlerRes = await fetch(`${baseUrl}/api/crawler`);
    const { data } = await crawlerRes.json();

    const allOpps = [];
    const seen = new Set();
    data.forEach((src) => {
      src.opportunities.forEach((opp) => {
        const key = opp.title.slice(0, 10);
        if (!seen.has(key)) {
          seen.add(key);
          allOpps.push(opp);
        }
      });
    });

    lastReport = { timestamp: new Date().toISOString(), opportunities: allOpps };
    return NextResponse.json({ success: true, report: lastReport });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
DAILY_EOF
echo "✅ 日报 API 已创建"

# 3. 飞书推送卡片
cat > app/api/feishu/route.js << 'FEISHU_EOF'
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feishuBody)
    });

    return NextResponse.json({ success: true, message: '推送成功' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
FEISHU_EOF
echo "✅ 飞书推送已更新（卡片行动号召）"

# 4. 定价页面
mkdir -p app/pricing
cat > app/pricing/page.tsx << 'PRICING_EOF'
'use client';
import { useState } from 'react';

const plans = [
  {
    name: '🆓 免费版',
    price: '0',
    period: '月',
    features: ['每日 1 条掘金机会', '基础思路摘要', '邮件/飞书推送'],
    cta: '免费订阅',
    href: '/api/feishu?subscribe=free',
    highlight: false
  },
  {
    name: '⚡ 标准版',
    price: '99',
    period: '月',
    features: ['每日 5 条完整机会', '细化行动计划 + 所需工具清单', '优先推送（早8点）', '专属执行 SOP 模板'],
    cta: '立即订阅',
    href: '/checkout?plan=standard',
    highlight: true
  },
  {
    name: '💎 高级版',
    price: '299',
    period: '月',
    features: ['全部标准版权益', '附带发布文案 / 代码模板', '每周一次变现复盘直播', '私人社群 + 优先答疑'],
    cta: '升级高级版',
    href: '/checkout?plan=pro',
    highlight: false
  },
  {
    name: '🏢 企业版（即将推出）',
    price: '499',
    period: '月',
    features: ['定制行业机会挖掘', 'API 批量获取', '专属客户经理'],
    cta: '联系咨询',
    href: 'mailto:hi@canzi-ai.com',
    highlight: false
  }
];

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="max-w-7xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold text-center mb-4">🚀 独立开发者掘金简报</h1>
      <p className="text-xl text-center text-gray-500 mb-8">
        把新闻变成收入，每天一份可执行的赚钱路线图
      </p>
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 rounded-full p-1 flex">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-6 py-2 rounded-full text-sm font-medium ${billing === 'monthly' ? 'bg-white shadow' : ''}`}
          >
            月付
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`px-6 py-2 rounded-full text-sm font-medium ${billing === 'yearly' ? 'bg-white shadow' : ''}`}
          >
            年付 (省20%)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const displayPrice = billing === 'yearly' ? Number(plan.price) * 0.8 : plan.price;
          return (
            <div
              key={plan.name}
              className={`border rounded-2xl p-6 flex flex-col ${plan.highlight ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}
            >
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <div className="text-4xl font-bold mb-1">
                ¥{displayPrice}
                <span className="text-base font-normal text-gray-400">/{plan.period}</span>
              </div>
              <ul className="mt-4 space-y-2 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span>✅</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={`mt-6 block text-center py-2 px-4 rounded-full font-medium ${plan.highlight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-300 hover:bg-gray-50'}`}
              >
                {plan.cta}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
PRICING_EOF
echo "✅ 定价页面已更新"

echo ""
echo "🎉 全部改造完成！运行 npm run dev 测试，然后部署到 Vercel。"
