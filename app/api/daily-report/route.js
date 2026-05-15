import { NextResponse } from 'next/server';

const fallbackOpportunity = {
  title: "3天搭建AI知识库月入1万",
  idea: "本地商户（口腔诊所、律师事务所、教培机构）每天重复回答相同问题，但无力自建AI系统。用开源Dify+DeepSeek API搭建垂直行业知识库SaaS，集成到商户公众号/企业微信，按年收费。需求刚性强（商户最痛的就是客服人力成本），技术门槛低（Dify拖拽式搭建），回本周期短（3天完成MVP、7天签首单）。关键避坑：先选一个垂类深耕，不要贪多。",
  target: "二线城市、有公众号/企业微信、日均咨询量>20条的本地服务商户（口腔、律所、教培优先）",
  cost: "时间3天 + ¥1,200（DeepSeek API预充¥500 + 轻量服务器¥200/月 + 域名¥100 + Dify开源免费）",
  revenue: "保守¥3,000/月（5个客户×¥600/年套餐÷12）| 乐观¥8,000/月（15个客户）| 爆发¥20,000/月（30个客户+增值服务）",
  difficulty: "低 · 只需基础Python，Dify拖拽操作无需机器学习经验",
  actions: [
    "整理口腔/律所行业100个高频FAQ（小红书搜'口腔常见问题'汇总）",
    "用Dify搭建知识库，接入DeepSeek API，测试30条问答准确率需≥85%",
    "制作3页PDF演示文档，含截图+客户案例",
    "联系5家本地商户提供7天免费试用",
    "收集反馈优化后推出¥600/年正式版"
  ],
  sop: "Day1：调研-整理行业FAQ+注册Dify+配置DeepSeek API（完成标准：知识库含50+FAQ）；Day3：搭建原型-完成知识库+接入测试公众号+自测20条对话（完成标准：准确率≥80%）；Day7：获客-制作演示文档+联系5家商户试用+收集3条反馈（完成标准：至少2家表示愿意付费）",
  tools: ["Dify.ai（开源AI应用搭建平台）", "DeepSeek API（大模型推理，¥1/百万token）", "微信公众号/企业微信（客户触达渠道）", "阿里云轻量服务器（部署，¥200/月）"],
  pitfall: "坑1：一次性做5个行业导致每个都不精→解法：先深耕1个行业做到极致再横向扩展；坑2：商户不信任AI回答质量→解法：前7天人工审核每一条回答，积累信任后再放开。"
};

let lastReport = { timestamp: null, opportunities: [] };

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier') || 'free';
    const limit = tier === 'paid' ? 5 : 1;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const crawlerRes = await fetch(`${baseUrl}/api/crawler`, { cache: 'no-store' });
    const { data } = await crawlerRes.json();

    const allOpps = [];
    const seen = new Set();
    data.forEach((src) => {
      src.opportunities.forEach((opp) => {
        const key = opp.title?.slice(0, 10);
        if (!seen.has(key)) {
          seen.add(key);
          allOpps.push(opp);
        }
      });
    });

    if (allOpps.length === 0) {
      allOpps.push(fallbackOpportunity);
    }

    const sliced = allOpps.slice(0, limit);
    lastReport = { timestamp: new Date().toISOString(), opportunities: sliced };
    return NextResponse.json({ success: true, report: lastReport, total: allOpps.length }, {
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
