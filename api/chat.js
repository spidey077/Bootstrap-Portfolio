export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a chatbot for Imdadullah's portfolio.

Facts:
- Imdadullah is a frontend developer
- Uses HTML, CSS, JavaScript, React, Next.js
- Builds custom coded websites
- Not a WordPress developer
- Not a no-code builder
- Services offered: High-Performance Websites, Website Design, Custom FAQ Chatbot Integration, AI Agents & Automation (n8n).

Rules:
- Answer only based on this info
- Be short and clear
- Keep answers under 2 sentences
- If unsure, say: "You can contact me for more details."
`
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
        return res.status(response.status).json(data);
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
