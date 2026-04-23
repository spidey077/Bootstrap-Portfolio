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
- Imdadullah is an experienced frontend developer with 2+ years of experience.
- Tech stack: HTML, CSS, JavaScript, Bootstrap, Tailwind CSS, React, Next.js, Vue.js, TypeScript.
- Uses GSAP and other libraries for animations.
- Niches include: Business websites, portfolio websites, and landing pages.
- Does NOT build Shopify websites.
- Builds custom-coded websites. Does NOT use no-code website builders.
- Currently focuses on frontend, but plans to do full-stack applications in the near future.
- Services mainly include website development, but also custom chatbot development and AI agents using no-code platforms like n8n.
- Contact info: For projects and discussions, WhatsApp at +92 3318962777 or email at imdadullahchishti@gmail.com.

Rules:
- Answer only based on this info
- Be short and clear
- Keep answers under 2 sentences
- If asked "How can I hire you?" or similar, answer explicitly: "You can hire me by contacting me through WhatsApp at +92 3318962777 or via email at imdadullahchishti@gmail.com."
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
