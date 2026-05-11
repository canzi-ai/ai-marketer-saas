export async function GET() {
  const results = {
    crawler: null,
    feishu: null,
    errors: []
  };

  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  // 第1步：抓取和分析
  try {
    const crawlerRes = await fetch(`${baseUrl}/api/crawler`);
    results.crawler = await crawlerRes.json();
  } catch (e) {
    results.errors.push('爬虫失败：' + e.message);
  }

  // 第2步：推送到飞书
  try {
    const feishuRes = await fetch(`${baseUrl}/api/feishu-report`);
    results.feishu = await feishuRes.json();
  } catch (e) {
    results.errors.push('飞书推送失败：' + e.message);
  }

  return Response.json({
    success: results.errors.length === 0,
    time: new Date().toISOString(),
    ...results
  });
}
