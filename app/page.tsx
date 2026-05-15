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

export default function HomePage() {
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
