export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, system } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: system }]
          },
          contents: messages,
          generationConfig: {
            temperature: 0.75,
            maxOutputTokens: 250,
            topP: 0.9
          }
        })
      }
    );

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Let me connect you with our team! 📱 wa.me/918383013079";

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({
      reply: "Kuch gadbad ho gayi! 😅\nTeam se baat karo:\n📱 +91 83830 13079"
    });
  }
}
