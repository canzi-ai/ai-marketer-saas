'use client';

import { useState } from 'react';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'price_1TWbX5C3CRNa0CYmjg42J0GJ' }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('支付创建失败：' + data.error);
      }
    } catch (e) {
      alert('网络错误，请稍后再试');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>🤖 AI 商机日报</h1>
      <p>每天自动抓取 Product Hunt 等平台最新 AI 产品，DeepSeek 深度分析变现机会，推送到你的飞书。</p>
      
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
        <h2>免费版</h2>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>¥0/月</p>
        <ul style={{ textAlign: 'left' }}>
          <li>每天 1 条商机快报</li>
          <li>基础分析摘要</li>
        </ul>
        <button disabled style={{ padding: '10px 30px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'not-allowed' }}>当前版本</button>
      </div>

      <div style={{ border: '2px solid #4CAF50', borderRadius: '8px', padding: '20px', margin: '20px 0', background: '#f0fff0' }}>
        <h2>付费版</h2>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>¥29.9/月</p>
        <ul style={{ textAlign: 'left' }}>
          <li>每天 5+ 条完整商机快报</li>
          <li>深度分析：目标用户 + 收入预估 + 实施难度</li>
          <li>多信息源融合（Product Hunt + Hacker News + GitHub Trending）</li>
          <li>直接推送到你的飞书/微信</li>
        </ul>
        <button 
          onClick={handleSubscribe}
          disabled={loading}
          style={{ padding: '12px 40px', background: loading ? '#ccc' : '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? '正在跳转支付...' : '立即订阅（¥29.9/月）'}
        </button>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          🔒 测试模式 · 使用测试卡号 4242 4242 4242 4242 即可支付
        </p>
      </div>
    </div>
  );
}
