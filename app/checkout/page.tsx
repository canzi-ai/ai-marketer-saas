'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'standard';
  const plans: Record<string, { name: string; price: string }> = {
    standard: { name: '⚡ 标准版', price: '¥99/月' },
    pro: { name: '💎 高级版', price: '¥299/月' },
  };
  const current = plans[plan] || plans.standard;

  return (
    <div className="max-w-lg mx-auto py-20 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">确认订阅</h1>
      <div className="bg-gray-50 rounded-2xl p-8 mb-6">
        <p className="text-lg mb-2">{current.name}</p>
        <p className="text-4xl font-bold">{current.price}</p>
      </div>
      <p className="text-gray-500 mb-6">
        支付功能即将上线。现在订阅请直接联系👇
      </p>
      <a
        href="mailto:hi@canzi-ai.com?subject=订阅{current.name}"
        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-blue-700"
      >
        联系订阅（前10名首月半价）
      </a>
      <p className="mt-4 text-sm text-gray-400">
        或搜索微信号添加：canzi-ai
      </p>
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
