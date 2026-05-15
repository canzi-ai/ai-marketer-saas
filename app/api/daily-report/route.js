import { NextResponse } from 'next/server';

// 内置兜底机会（不再外部导入）
const fallbackOpportunity = {
  title: "AI知识库模板化",
  idea: "把常见行业（口腔/律所/教培）的FAQ整理成结构化模板，用开源的Dify或FastGPT一键部署，向本地商户按年收费。",
  target: "没有技术团队的中小型服务企业",
  cost: "时间2天 + 服务器成本¥50/月",
  revenue: "¥3,000-10,000/月",
  difficulty: "低",
  actions: ["整理10个行业FAQ样本", "用Dify搭建第一个演示版", "去本地商会联系两家口腔诊所试用"]
};

let lastReport = { timestamp: null, opportunities: [] };

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const crawlerRes = await fetch(`${baseUrl}/api/crawler`, { cache: 'no-store' });
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

    if (allOpps.length === 0) {
      allOpps.push(fallbackOpportunity);
    }

    lastReport = { timestamp: new Date().toISOString(), opportunities: allOpps };
    return NextResponse.json({ success: true, report: lastReport }, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (error) {
    lastReport = { timestamp: new Date().toISOString(), opportunities: [fallbackOpportunity] };
    return NextResponse.json({ success: true, report: lastReport }, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}

export async function POST() {
  return GET();
}
