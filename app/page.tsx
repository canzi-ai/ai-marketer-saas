'use client';
import { useState, useEffect } from 'react';

const CHECKOUT_URL = 'https://canzi-ai.com/checkout?plan=standard';

const plans = [
  {
    name: '🆓 免费版',
    price: '0',
    period: '',
    features: ['每日 1 条机会（网页看标题+客户）', '公开推送'],
    cta: '往下看今日机会 ↓',
    href: '#today-opportunity',
    highlight: false
  },
  {
    name: '⚡ 付费版',
    price: '9.9',
    period: '首月',
    features: ['每日 5 条完整机会 + 行动清单', '飞书私密推送', '执行 SOP 模板', '所需工具清单', '次月起 ¥29/月，随时取消'],
    cta: '首月 ¥9.9 订阅',
    href: CHECKOUT_URL,
    highlight: true
  },
  {
    name: '💎 深度版',
    price: '99',
    period: '月',
    features: ['全部付费版权益', '每周 1v1 语音：帮你挑机会落地', '发布文案 / 代码模板', '私人答疑群'],
    cta: '联系升级',
    href: 'mailto:hi@canzi-ai.com?subject=升级深度版',
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">🚀 独立开发者掘金简报</h1>
        <p className="text-lg text-gray-500">AI 抓取行业动态 → 提炼可执行的赚钱机会 → 每天推给你</p>
        <p className="text-sm text-gray-400 mt-1">每日由 AI 自动生成 · 付费版附人工筛选</p>
      </div>

      <div id="today-opportunity" className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-6 text-white">
        <p className="text-sm opacity-80 mb-1">📅 {new Date().toLocaleDateString('zh-CN')} · 今日免费机会 · AI自动生成仅供参考</p>
        {loading ? (
          <p className="text-lg mt-4">⏳ 正在抓取最新机会...</p>
        ) : todayOpp ? (
          <>
            <h2 className="text-3xl font-bold mt-2 mb-2">🔥 {todayOpp.title}</h2>
            <p className="text-lg opacity-90 mb-4">🎯 {todayOpp.target}</p>
            
            <div className="bg-white/10 rounded-xl p-5 mb-4 backdrop-blur-sm">
              <p className="text-sm opacity-70 mb-2">💡 机会详情 + 📋 行动清单</p>
              <div className="blur-sm select-none opacity-50">
                <p className="text-sm mb-1">{todayOpp.idea?.substring(0, 60)}...</p>
                <p className="text-sm">💰 {todayOpp.revenue} · ⚡ {todayOpp.difficulty} · {todayOpp.cost}</p>
                <p className="text-sm mt-1">📋 {todayOpp.actions?.join(' · ')}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold mb-2">🔒 完整行动清单 + 今天还有 4 条隐藏机会</p>
              <a
                href={CHECKOUT_URL}
                className="inline-block bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition shadow-lg"
              >
                首月 ¥9.9 解锁全部
              </a>
              <p className="text-sm opacity-70 mt-2">次月起 ¥29/月 · 30天无理由退款</p>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-lg">今日机会正在生成中，稍后刷新</p>
          </div>
        )}
      </div>

      <div className="text-center mb-8 mt-12">
        <h2 className="text-3xl font-bold mb-2">选择你的掘金计划</h2>
        <p className="text-gray-500">看标题免费，看执行付费 — 首月 ¥9.9 试用</p>
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

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const displayPrice = billing === 'yearly' && plan.price !== '0' ? Math.round(Number(plan.price) * 0.8) : plan.price;
          return (
            <div
              key={plan.name}
              className={`border rounded-2xl p-6 flex flex-col ${plan.highlight ? 'border-blue-500 shadow-xl ring-2 ring-blue-100' : 'border-gray-200'}`}
            >
              {plan.highlight && (
                <p className="text-xs text-blue-600 font-semibold mb-2">⭐ 最受欢迎</p>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-1">
                ¥{displayPrice}
                {plan.period && <span className="text-base font-normal text-gray-400">/{plan.period}</span>}
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

      <div className="text-center mt-12 text-sm text-gray-400">
        <p>💬 有任何问题？<a href="mailto:hi@canzi-ai.com" className="underline">hi@canzi-ai.com</a></p>
        <p className="mt-1">🔒 30 天无理由退款 · 首月 ¥9.9 零风险试用</p>
      </div>
    </div>
  );
}
