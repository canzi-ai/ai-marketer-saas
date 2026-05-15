'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'standard';
  const plans: Record<string, { name: string; price: string; desc: string; firstMonth: string }> = {
    standard: { name: '⚡ 付费版', price: '¥29/月', firstMonth: '¥9.9', desc: '每日5条机会+飞书推送' },
    pro: { name: '💎 深度版', price: '¥99/月', firstMonth: '¥99', desc: '全部+1v1语音' },
  };
  const current = plans[plan] || plans.standard;

  return (
    <div className="max-w-lg mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold mb-3">确认订阅</h1>
      <div className="bg-gray-50 rounded-2xl p-8 mb-6">
        <p className="text-lg mb-2">{current.name}</p>
        <div className="flex items-center justify-center gap-3 mb-1">
          {current.firstMonth !== current.price && (
            <span className="text-lg text-gray-400 line-through">{current.price}</span>
          )}
          <p className="text-5xl font-bold text-blue-600">{current.firstMonth}首月</p>
        </div>
        <p className="text-sm text-gray-400 mt-1">{current.desc}</p>
        {current.firstMonth !== current.price && (
          <p className="text-sm text-green-600 mt-2 font-medium">🎉 次月起恢复 {current.price}，随时可取消</p>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
        <p className="text-lg font-semibold text-green-800 mb-3">📱 30秒完成订阅</p>
        <div className="bg-white rounded-xl p-4 mb-3 inline-block border-2 border-dashed border-green-300">
          <p className="text-6xl mb-2">📱</p>
          <p className="text-sm text-gray-500 font-mono">扫码添加微信</p>
          <p className="text-xs text-gray-400 mt-1">（替换为你的微信二维码图片）</p>
        </div>
        <p className="text-sm text-gray-600 mb-2">或手动搜索微信号：</p>
        <p className="text-xl font-bold font-mono bg-white inline-block px-6 py-2 rounded-full border">canzi-ai</p>
        <p className="text-xs text-gray-400 mt-3">添加后发送「订阅付费版」</p>
      </div>

      <div className="text-sm text-gray-500 space-y-1">
        <p>💳 支持微信支付 / 支付宝</p>
        <p>🔒 首月 ¥9.9 · 次月 ¥29 · 随时取消</p>
        <p>↩️ 30天无理由退款</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">加载中...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
