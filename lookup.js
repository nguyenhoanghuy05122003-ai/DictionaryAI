// Vercel Serverless Function: gọi Claude API, giữ API key ở phía server
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ fail: true });
  const prompt = String((req.body && req.body.prompt) || '').slice(0, 2000);
  if (!prompt) return res.status(400).json({ fail: true });
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-5-5',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const j = await r.json();
    const text = (j.content || []).map(c => c.text || '').join('').replace(/```json|```/g, '').trim();
    res.status(200).json(JSON.parse(text));
  } catch (e) {
    res.status(500).json({ fail: true });
  }
};
