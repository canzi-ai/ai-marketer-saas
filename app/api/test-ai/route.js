import OpenAI from 'openai';

export async function GET() {
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "user", content: "你好DeepSeek！用一句话介绍你自己" }
    ],
  });

  return Response.json({ result: completion.choices[0].message.content });
}
