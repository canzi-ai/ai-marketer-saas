'use client';
import { useState, useEffect, useCallback } from 'react';

interface Opp {
  title: string;
  idea: string;
  target: string;
  cost: string;
  revenue: string;
  difficulty: string;
  actions: string[];
  sop: string;
}

export default function AdminPage() {
  const [paidData, setPaidData] = useState<Opp[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');

  const fetchPaidContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/daily-report?tier=paid');
      const data = await res.json();
      setPaidData(data.report?.opportunities || []);
      showStatus(`✅ 已获取 ${data.report?.opportunities?.length || 0} 条机会`, 'success');
    } catch (e: any) {
      showStatus('❌ 获取失败：' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPaidContent(); }, []);

  function showStatus(msg: string, type: 'success' | 'error') {
    setStatusMsg(msg);
    setStatusType(type);
  }

  function copyToClipboard() {
    let text = '🚀 独立开发者掘金简报 · 付费版\n' + new Date().toLocaleDateString('zh-CN') + '\n━━━━━━━━━━━━━━━━\n\n';
    paidData.forEach((opp, i) => {
      text += `${i + 1}. ${opp.title}\n`;
      text += `💡 ${opp.idea}\n`;
      text += `🎯 ${opp.target}\n`;
      text += `💰 ${opp.revenue} | ⚡ ${opp.difficulty} | ${opp.cost}\n`;
      text += `📋 ${(opp.actions || []).join(' → ')}\n`;
      text += `📝 SOP：${opp.sop || '暂无'}\n`;
      text += '\n━━━━━━━━━━━━━━━━\n\n';
    });
    navigator.clipboard.writeText(text).then(() => {
      showStatus('✅ 已复制，直接粘贴发给客户', 'success');
    });
  }

  async function pushToFeishu() {
    try {
      const res = await fetch('/api/feishu', { method: 'POST' });
      const data = await res.json();
      showStatus(data.success ? '✅ 已推送到飞书群' : '❌ ' + (data.error || '失败'), data.success ? 'success' : 'error');
    } catch (e: any) {
      showStatus('❌ ' + e.message, 'error');
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f5f5f5', minHeight: '100vh', padding: 20 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 20 }}>📬 付费内容发送</h1>
        <div style={{ marginBottom: 16 }}>
          <button onClick={fetchPaidContent} style={{ padding: '12px 24px', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: 16, marginRight: 12, background: '#1a56db', color: 'white' }}>🔄 获取今日付费内容</button>
          <button onClick={copyToClipboard} disabled={!paidData.length} style={{ padding: '12px 24px', borderRadius: 8, fontWeight: 600, border: 'none', cursor: paidData.length ? 'pointer' : 'not-allowed', fontSize: 16, marginRight: 12, background: '#e5e7eb', color: '#333', opacity: paidData.length ? 1 : 0.5 }}>📋 一键复制</button>
          <button onClick={pushToFeishu} disabled={!paidData.length} style={{ padding: '12px 24px', borderRadius: 8, fontWeight: 600, border: 'none', cursor: paidData.length ? 'pointer' : 'not-allowed', fontSize: 16, background: '#e5e7eb', color: '#333', opacity: paidData.length ? 1 : 0.5 }}>📤 推送到飞书</button>
        </div>

        {statusMsg && (
          <div style={{ padding: 12, borderRadius: 8, marginBottom: 16, background: statusType === 'success' ? '#dcfce7' : '#fee2e2', color: statusType === 'success' ? '#166534' : '#991b1b' }}>{statusMsg}</div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', padding: 40, color: '#666' }}>⏳ DeepSeek 分析中...</p>
        ) : (
          <>
            <p style={{ marginBottom: 12, color: '#666' }}>📅 {new Date().toLocaleDateString('zh-CN')} · 共 {paidData.length} 条</p>
            {paidData.map((opp, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ color: '#1a56db', marginBottom: 8 }}>{i + 1}. {opp.title}</h2>
                <p style={{ marginBottom: 6, fontSize: 14 }}><strong>💡</strong> {opp.idea}</p>
                <p style={{ marginBottom: 6, fontSize: 14 }}><strong>🎯</strong> {opp.target}</p>
                <p style={{ marginBottom: 6, fontSize: 14 }}><strong>💰</strong> {opp.revenue} · ⚡{opp.difficulty} · {opp.cost}</p>
                <p style={{ marginBottom: 6, fontSize: 14 }}><strong>📋</strong> {(opp.actions || []).join(' → ')}</p>
                <div style={{ background: '#f0fdf4', borderLeft: '4px solid #22c55e', padding: 12, marginTop: 8, borderRadius: '0 8px 8px 0' }}>
                  <strong>📝 执行SOP：</strong>{opp.sop || '暂无'}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
