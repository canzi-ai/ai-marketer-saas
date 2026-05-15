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
  tools: string;
  pitfall: string;
}

export default function AdminPage() {
  const [paidData, setPaidData] = useState<Opp[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');

  const fetchPaidContent = useCallback(async () => {
    setLoading(true);
    setStatusMsg('');
    try {
      const res = await fetch('/api/daily-report?tier=paid');
      const data = await res.json();
      setPaidData(data.report?.opportunities || []);
      showStatus(`✅ DeepSeek 深度分析完成 · 今日推送 ${data.report?.opportunities?.length || 0} 条掘金机会（附完整SOP+工具栈+避坑指南）`, 'success');
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
    let text = '';
    text += '━━━━━━━━━━━━━━━━━━━━\n';
    text += '🚀 独立开发者掘金简报 · 付费版\n';
    text += '📅 ' + new Date().toLocaleDateString('zh-CN') + '\n';
    text += '━━━━━━━━━━━━━━━━━━━━\n\n';
    paidData.forEach((opp, i) => {
      text += `┏━━━━ 机会 ${i + 1}/${paidData.length} ━━━━┓\n\n`;
      text += `🔥 ${opp.title}\n\n`;
      text += `💡 为什么能做 & 怎么做\n${opp.idea}\n\n`;
      text += `🎯 精准客户画像\n${opp.target}\n\n`;
      text += `💰 收入潜力（三档预估）\n${opp.revenue}\n\n`;
      text += `⚡ 启动成本 & 难度\n${opp.cost}\n${opp.difficulty}\n\n`;
      text += `📋 5步行动清单\n${(opp.actions || []).map((a, ai) => `  ${ai + 1}. ${a}`).join('\n')}\n\n`;
      text += `📝 7天执行SOP\n${opp.sop || '暂无'}\n\n`;
      text += `🛠 推荐工具栈\n${opp.tools || '暂无'}\n\n`;
      text += `⚠️ 避坑指南\n${opp.pitfall || '暂无'}\n\n`;
      text += '━━━━━━━━━━━━━━━━━━━━\n\n';
    });
    navigator.clipboard.writeText(text).then(() => {
      showStatus('✅ 已复制全部内容（含SOP+工具+避坑），直接粘贴发给客户', 'success');
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

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: 16,
    padding: '32px 28px',
    marginBottom: 24,
    color: '#e2e8f0',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
  };

  const tagStyle = (bg: string): React.CSSProperties => ({
    background: bg,
    color: '#fff',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    display: 'inline-block',
    marginRight: 8,
    marginBottom: 6,
  });

  const sectionTitle: React.CSSProperties = {
    color: '#60a5fa',
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 8,
    marginTop: 20,
  };

  const sectionBox: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 16,
    marginTop: 6,
    lineHeight: 1.8,
    fontSize: 14,
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#0f172a', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ color: '#f1f5f9', fontSize: 28, margin: 0 }}>📬 付费内容发送</h1>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: '4px 0 0' }}>DeepSeek 深度分析 · 5条机会 + 完整SOP + 工具栈 + 避坑</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={fetchPaidContent} style={{ padding: '12px 20px', borderRadius: 10, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 15, background: '#3b82f6', color: '#fff' }}>
              🔄 重新生成
            </button>
            <button onClick={copyToClipboard} disabled={!paidData.length} style={{ padding: '12px 20px', borderRadius: 10, fontWeight: 700, border: 'none', cursor: paidData.length ? 'pointer' : 'not-allowed', fontSize: 15, background: paidData.length ? '#22c55e' : '#334155', color: '#fff', opacity: paidData.length ? 1 : 0.6 }}>
              📋 一键复制
            </button>
            <button onClick={pushToFeishu} disabled={!paidData.length} style={{ padding: '12px 20px', borderRadius: 10, fontWeight: 700, border: 'none', cursor: paidData.length ? 'pointer' : 'not-allowed', fontSize: 15, background: paidData.length ? '#8b5cf6' : '#334155', color: '#fff', opacity: paidData.length ? 1 : 0.6 }}>
              📤 推飞书
            </button>
          </div>
        </div>

        {statusMsg && (
          <div style={{ padding: '14px 18px', borderRadius: 10, marginBottom: 20, background: statusType === 'success' ? '#065f46' : '#7f1d1d', color: statusType === 'success' ? '#a7f3d0' : '#fecaca', fontSize: 14, fontWeight: 500 }}>
            {statusMsg}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <p style={{ color: '#94a3b8', fontSize: 18 }}>DeepSeek 正在深度分析行业动态...</p>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>提取可执行机会 + 生成SOP + 匹配工具栈</p>
          </div>
        ) : (
          <>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
              📅 {new Date().toLocaleDateString('zh-CN')} · 共 {paidData.length} 条机会 · 每条含完整交付物
            </p>
            {paidData.map((opp, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ background: '#3b82f6', color: '#fff', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <h2 style={{ color: '#f1f5f9', fontSize: 22, margin: 0, fontWeight: 700 }}>{opp.title}</h2>
                </div>

                <div style={sectionTitle}>💡 为什么能做 & 怎么做</div>
                <div style={sectionBox}>{opp.idea}</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                  <div>
                    <div style={sectionTitle}>🎯 精准客户</div>
                    <div style={sectionBox}>{opp.target}</div>
                  </div>
                  <div>
                    <div style={sectionTitle}>⚡ 成本 & 难度</div>
                    <div style={sectionBox}>
                      <div style={{ marginBottom: 6 }}>💰 {opp.cost}</div>
                      <div style={{ color: opp.difficulty?.includes('低') ? '#4ade80' : opp.difficulty?.includes('中') ? '#fbbf24' : '#f87171' }}>📊 {opp.difficulty}</div>
                    </div>
                  </div>
                </div>

                <div style={sectionTitle}>📈 收入潜力（三档预估）</div>
                <div style={sectionBox}>{opp.revenue}</div>

                <div style={sectionTitle}>📋 5步行动清单</div>
                <div style={sectionBox}>
                  {(opp.actions || []).map((a, ai) => (
                    <div key={ai} style={{ marginBottom: 6 }}>✔ {a}</div>
                  ))}
                </div>

                <div style={sectionTitle}>📝 7天执行SOP</div>
                <div style={sectionBox}>{opp.sop}</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                  <div>
                    <div style={sectionTitle}>🛠 推荐工具栈</div>
                    <div style={sectionBox}>{opp.tools}</div>
                  </div>
                  <div>
                    <div style={sectionTitle}>⚠️ 避坑指南</div>
                    <div style={{ ...sectionBox, borderLeft: '3px solid #f87171' }}>{opp.pitfall}</div>
                  </div>
                </div>

                <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={tagStyle('#7c3aed')}>可执行</span>
                  <span style={tagStyle('#059669')}>低风险</span>
                  <span style={tagStyle('#d97706')}>高回报</span>
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: 13 }}>
              <p>━━━ 付费版 END · 明日继续 ━━━</p>
              <p style={{ marginTop: 8 }}>以上内容由 DeepSeek 深度分析生成 · 附人工审核</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
