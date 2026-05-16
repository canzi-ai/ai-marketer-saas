'use client';
import { useState, useEffect } from 'react';

const CHECKOUT_URL = 'https://canzi-ai.com/checkout?plan=standard';

export default function HomePage() {
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

  const deviceIcon = todayOpp?.device === '手机' ? '📱' : '💻';
  const deviceLabel = todayOpp?.device === '手机' ? '只需手机即可' : '需要电脑';

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: 800, margin: '0 auto', padding: '24px 16px 60px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 'clamp(28px,5vw,40px)', fontWeight: 800, marginBottom: 8, color: '#0f172a' }}>
          🚀 每天一个赚钱机会
        </h1>
        <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.6, maxWidth: 500, margin: '0 auto' }}>
          不是新闻，是<b style={{ color: '#2563eb' }}>你可以立刻动手</b>的赚钱路线图
        </p>
        <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>每日自动分析 · 免费公开 1 条</p>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
        borderRadius: 20,
        padding: '32px 24px',
        marginBottom: 24,
        color: '#fff',
        boxShadow: '0 8px 40px rgba(124,58,237,0.3)',
      }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
            📅 {new Date().toLocaleDateString('zh-CN')}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
            免费公开
          </span>
          <span style={{ background: todayOpp?.device === '手机' ? '#22c55e' : '#3b82f6', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            {deviceIcon} {deviceLabel}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
            <p style={{ fontSize: 18 }}>正在挖掘今天的赚钱机会...</p>
          </div>
        ) : todayOpp ? (
          <>
            <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, marginBottom: 8, lineHeight: 1.3 }}>
              🔥 {todayOpp.title}
            </h2>

            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 14,
              padding: '16px 20px',
              marginBottom: 16,
              backdropFilter: 'blur(10px)',
            }}>
              <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>📈 收入潜力预估</p>
              <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.6 }}>{todayOpp.revenue}</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>🎯 目标客户</p>
              <p style={{ fontSize: 15, lineHeight: 1.5 }}>{todayOpp.target}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12 }}>
                <p style={{ fontSize: 12, opacity: 0.7 }}>💰 启动成本</p>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{todayOpp.cost}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12 }}>
                <p style={{ fontSize: 12, opacity: 0.7 }}>⚡ 难度</p>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{todayOpp.difficulty}</p>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 16,
              padding: '20px 24px',
              marginBottom: 20,
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: '#fbbf24' }}>
                🔒 以下内容只对付费用户开放
              </p>
              <div style={{ filter: 'blur(6px)', userSelect: 'none', opacity: 0.5 }}>
                <p style={{ marginBottom: 8 }}>{(todayOpp.idea || '').substring(0, 80)}...</p>
                <p>📋 5步行动清单（已隐藏）</p>
                <p>📝 执行SOP（已隐藏）</p>
                <p>🛠 工具栈（已隐藏）</p>
                <p>⚠️ 避坑指南（已隐藏）</p>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                👆 每天还有 4 条隐藏机会 + 完整SOP
              </p>
              <a href={CHECKOUT_URL} style={{
                display: 'inline-block',
                background: '#fbbf24',
                color: '#1e293b',
                padding: '16px 36px',
                borderRadius: 50,
                fontSize: 18,
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(251,191,36,0.5)',
              }}>
                🔓 首月 ¥9.9 解锁全部
              </a>
              <p style={{ fontSize: 13, opacity: 0.8, marginTop: 8 }}>次月起 ¥29/月 · 30天无理由退款</p>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ fontSize: 18 }}>机会正在生成中，稍后刷新</p>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24, marginTop: 40 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>选择你的计划</h2>
        <p style={{ color: '#64748b' }}>免费看标题 · 付费看执行 · 首月 ¥9.9 零风险</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {[
          { name: '🆓 免费版', price: '0', period: '', features: ['每日 1 条机会（网页看）', '公开推送'], cta: '只看免费的', href: '#today-opportunity', hl: false },
          { name: '⚡ 付费版', price: '9.9', period: '首月', features: ['每日 5 条完整机会', '飞书/微信私密推送', '7天执行SOP', '工具栈+避坑指南', '次月起 ¥29/月'], cta: '首月 ¥9.9 订阅', href: CHECKOUT_URL, hl: true },
          { name: '💎 深度版', price: '99', period: '月', features: ['全部付费版权益', '每周 1v1 语音指导', '发布文案/代码模板', '私人答疑群'], cta: '联系升级', href: 'mailto:hi@canzi-ai.com', hl: false },
        ].map((plan, i) => (
          <div key={i} style={{
            border: plan.hl ? '2px solid #3b82f6' : '1px solid #e2e8f0',
            borderRadius: 16,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: plan.hl ? '0 4px 24px rgba(59,130,246,0.15)' : 'none',
            background: '#fff',
          }}>
            {plan.hl && <p style={{ fontSize: 12, color: '#3b82f6', fontWeight: 700, marginBottom: 8 }}>⭐ 最受欢迎</p>}
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{plan.name}</h3>
            <p style={{ fontSize: 32, fontWeight: 800, marginBottom: 2, color: plan.hl ? '#3b82f6' : '#0f172a' }}>
              ¥{plan.price}
              {plan.period && <span style={{ fontSize: 14, fontWeight: 400, color: '#94a3b8' }}>/{plan.period}</span>}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', flex: 1 }}>
              {plan.features.map((f, fi) => (
                <li key={fi} style={{ fontSize: 14, padding: '4px 0', color: '#475569', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <span>✅</span> {f}
                </li>
              ))}
            </ul>
            <a href={plan.href} style={{
              display: 'block', textAlign: 'center', padding: '12px 0', borderRadius: 50, fontWeight: 700, fontSize: 15,
              textDecoration: 'none', background: plan.hl ? '#3b82f6' : plan.cta.includes('免费') ? '#f1f5f9' : '#fff',
              color: plan.hl ? '#fff' : '#334155', border: plan.hl ? 'none' : '1px solid #e2e8f0',
            }}>{plan.cta}</a>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 32, color: '#94a3b8', fontSize: 13 }}>
        <p>💬 问题？<a href="mailto:hi@canzi-ai.com" style={{ color: '#3b82f6' }}>hi@canzi-ai.com</a></p>
        <p style={{ marginTop: 4 }}>🔒 30天无理由退款 · 零风险</p>
      </div>
    </div>
  );
}
