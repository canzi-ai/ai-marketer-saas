'use client';
import { useState, useEffect } from 'react';

const plans = [
  {
    name: '🆓 免费版',
    price: '0',
    period: '月',
    features: ['每日 1 条掘金机会（网页直接看）', '基础思路摘要', '公开推送'],
    cta: '往下看今日机会 ↓',
    href: '#today-opportunity',
    highlight: false
  },
  {
    name: '⚡ 标准版',
    price: '99',
    period: '月',
    features: ['每日 5 条完整机会', '飞书/微信私密推送', '细化行动计划 + 所需工具清单', '优先推送（早8点）', '专属执行 SOP 模板'],
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

export default function HomePage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [todayOpp, setTodayOpp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/daily-report')
      .then(res => res.json())
      .then(data => {
        if (data.report?.opportunities?.length > 0) {
          setTodayOpp(data.report.opportunities[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* 今日免费机会 */}
      <div id="today-opportunity" className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 text-white">
        <p className="text-sm opacity-80 mb-1">📅 {new Date().toLocaleDateString('zh-CN')} · 今日免费机会</p>
        {loading ? (
          <p className="text-lg">正在抓取最新机会...</p>
        ) : todayOpp ? (
          <>
            <h2 className="text-3xl font-bold mt-2 mb-4">🔥 {todayOpp.title}</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="opacity-70 mb-1">💡 机会描述</p>
                <p>{todayOpp.idea}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="opacity-70 mb-1">🎯 目标客户</p>
                <p>{todayOpp.target}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="opacity-70 mb-1">💰 预估收入</p>
                <p className="text-xl font-bold">{todayOpp.revenue}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="opacity-70 mb-1">⚡ 难度 / 成本</p>
                <p>{todayOpp.difficulty} · {todayOpp.cost}</p>
              </div>
            </div>
            <div className="mt-4 bg-white/10 rounded-xl p-4">
              <p className="opacity-70 mb-1">📋 行动清单</p>
              <ul className="list-disc list-inside">
                {todayOpp.actions.map((a: string, i: number) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-lg">今日机会正在生成中，稍后刷新页面查看</p>
        )}
      </div>

      {/* 付费升级引导 */}
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600">👆 上面是免费版每日 1 条。想每天收到 5 条 + 执行 SOP + 私密推送？</p>
      </div>

      {/* 定价套餐 */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">🚀 选择你的掘金计划</h2>
        <p className="text-gray-500">把新闻变成收入，每天一份可执行的赚钱路线图</p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="bg-gray-100 rounded-full p-1 flex">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${billing === 'monthly' ? 'bg-white shadow' : ''}`}
          >
            月付
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${billing === 'yearly' ? 'bg-white shadow' : ''}`}
          >
            年付 (省20%)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const displayPrice = billing === 'yearly' && plan.price !== '0' ? Math.round(Number(plan.price) * 0.8) : plan.price;
          return (
            <div
              key={plan.name}
              className={`border rounded-2xl p-6 flex flex-col ${plan.highlight ? 'border-blue-500 shadow-xl ring-2 ring-blue-100' : 'border-gray-200'}`}
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-1">
                ¥{displayPrice}
                <span className="text-base font-normal text-gray-400">/{plan.period}</span>
              </div>
              <ul className="mt-4 space-y-2 flex-1 text-sm">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0">✅</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={`mt-6 block text-center py-2.5 px-4 rounded-full font-medium text-sm transition ${
                  plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : plan.cta.includes('↓')
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          );
        })}
      </div>

      {/* 底部信心担保 */}
      <div className="text-center mt-12 text-sm text-gray-400">
        <p>📬 付费用户开通后，每日早 8 点飞书/微信私密推送</p>
        <p className="mt-1">💬 有任何问题？联系 <a href="mailto:hi@canzi-ai.com" className="underline">hi@canzi-ai.com</a></p>
      </div>
    </div>
  );
}
