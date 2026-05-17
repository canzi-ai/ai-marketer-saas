'use client';
export default function ExtractorLanding() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 700, margin: '0 auto', padding: '60px 20px', textAlign: 'center', background: '#fff', minHeight: '100vh' }}>
      <span style={{ fontSize: 64 }}>🧠</span>
      <h1 style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, margin: '16px 0 8px', color: '#0f172a' }}>AI Content Extractor</h1>
      <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.6, maxWidth: 500, margin: '0 auto 32px' }}>
        Extract structured insights from any webpage with AI.<br/>Free 5 extractions per day. Pro $5/month unlimited.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 500, margin: '0 auto' }}>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 32 }}>
          <h3 style={{ fontSize: 20, marginBottom: 8 }}>🆓 Free</h3>
          <p style={{ fontSize: 36, fontWeight: 800 }}>$0</p>
          <ul style={{ textAlign: 'left', fontSize: 14, color: '#475569', marginTop: 16, paddingLeft: 20 }}>
            <li>5 extractions/day</li>
            <li>Summary & key points</li>
            <li>Entities extraction</li>
            <li>Watermark on results</li>
          </ul>
          <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener" style={{ display: 'block', marginTop: 20, padding: '12px', border: '2px solid #e2e8f0', borderRadius: 50, fontWeight: 600, textDecoration: 'none', color: '#334155' }}>Install Free</a>
        </div>
        <div style={{ border: '2px solid #4f46e5', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(79,70,229,0.15)' }}>
          <h3 style={{ fontSize: 20, marginBottom: 8 }}>💎 Pro</h3>
          <p style={{ fontSize: 36, fontWeight: 800, color: '#4f46e5' }}>$5<span style={{ fontSize: 16, color: '#94a3b8' }}>/mo</span></p>
          <ul style={{ textAlign: 'left', fontSize: 14, color: '#475569', marginTop: 16, paddingLeft: 20 }}>
            <li>Unlimited extractions</li>
            <li>No watermark</li>
            <li>Actionable insights</li>
            <li>Priority support</li>
          </ul>
          <a href="https://canzi.lemonsqueezy.com" target="_blank" rel="noopener" style={{ display: 'block', marginTop: 20, padding: '12px', background: '#4f46e5', color: '#fff', borderRadius: 50, fontWeight: 600, textDecoration: 'none' }}>Upgrade to Pro</a>
        </div>
      </div>
      
      <div style={{ marginTop: 60, padding: 24, background: '#0f172a', borderRadius: 20, color: '#e2e8f0', textAlign: 'left', maxWidth: 500, margin: '60px auto 0' }}>
        <h3 style={{ marginBottom: 12, color: '#60a5fa' }}>📄 Sample Extraction</h3>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>Here's what you get from any webpage:</p>
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 16, fontSize: 13, lineHeight: 1.6 }}>
          <p style={{ color: '#60a5fa', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>📌 AI in 2026: Enterprise Trends</p>
          <p style={{ marginBottom: 12 }}>AI is reshaping enterprises in 2026 with agent-based automation, real-time data processing, and personalized customer experiences.</p>
          <p style={{ color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', marginBottom: 4 }}>Key Points</p>
          <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
            <li>AI agents reduce customer service costs by 40%</li>
            <li>65% of enterprises adopted AI agents in Q1 2026</li>
            <li>Real-time AI analytics boost conversion rates 2.3x</li>
          </ul>
          <p style={{ color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', marginBottom: 4 }}>Entities</p>
          <span style={{ display: 'inline-block', background: '#1e3a5f', color: '#60a5fa', padding: '2px 8px', borderRadius: 12, fontSize: 11, margin: '2px 4px' }}>AI</span>
          <span style={{ display: 'inline-block', background: '#1e3a5f', color: '#60a5fa', padding: '2px 8px', borderRadius: 12, fontSize: 11, margin: '2px 4px' }}>Enterprise</span>
          <span style={{ display: 'inline-block', background: '#1e3a5f', color: '#60a5fa', padding: '2px 8px', borderRadius: 12, fontSize: 11, margin: '2px 4px' }}>Automation</span>
          <p style={{ color: '#4ade80', fontSize: 12, marginTop: 12 }}>💡 Actionable: Build a niche AI agent for one vertical (e.g., dental clinics) and sell it as a SaaS.</p>
        </div>
      </div>
    </div>
  );
}
