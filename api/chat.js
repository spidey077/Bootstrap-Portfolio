export const config = {
  runtime: 'edge',
};

// In-memory rate limiting map
// This will reset on cold starts, but provides basic protection
const ipRateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  // Basic Rate Limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();

  if (ip !== 'unknown') {
    const userLimit = ipRateLimitMap.get(ip) || { count: 0, startTime: now };

    if (now - userLimit.startTime > RATE_LIMIT_WINDOW_MS) {
      // Reset window
      userLimit.count = 1;
      userLimit.startTime = now;
    } else {
      userLimit.count++;
      if (userLimit.count > MAX_REQUESTS_PER_WINDOW) {
        return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), { status: 429 });
      }
    }
    ipRateLimitMap.set(ip, userLimit);

    // Cleanup old entries occasionally to prevent memory leaks in the edge node
    if (ipRateLimitMap.size > 1000) {
      for (const [key, value] of ipRateLimitMap.entries()) {
        if (now - value.startTime > RATE_LIMIT_WINDOW_MS) {
          ipRateLimitMap.delete(key);
        }
      }
    }
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), { status: 400 });
    }

    // --- LEAD CAPTURE LOGIC (Discord Webhook) ---
    // Using Environment Variable for security
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL; 

    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        // Simple regex to check if user typed an email address
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
        const match = lastMessage.content.match(emailRegex);

        if (match && DISCORD_WEBHOOK_URL) {
          const email = match[0];
          // Get the last 3 messages for context
          const context = messages.slice(-3).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\\n');

          try {
            // Fire webhook in background without slowing down chat
            fetch(DISCORD_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: `**🚨 NEW PORTFOLIO LEAD DETECTED! 🚨**\n**Email captured:** \`${email}\`\n\n**Recent Chat Context:**\n\`\`\`text\n${context}\n\`\`\``
              })
            }).catch(e => console.error("Discord Webhook Error", e));
          } catch (e) {
            console.error("Failed to execute webhook", e);
          }
        }
      }
    }
    // --------------------------------------------

    const systemPrompt = {
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
- If asked "How can I hire you?" or if the user wants to start a project, explicitly ask: "Please provide your email address so Imdadullah can reach out, or contact him directly on WhatsApp at +92 3318962777."
- If the user provides an email address, say: "Thank you! I will forward your details to Imdadullah right away."
- If unsure about the answer to a question, explicitly ask the user for their email address by saying: "I'm not sure about that, but please provide your email address and Imdadullah will reply to you manually."
`
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [systemPrompt, ...messages],
        stream: true
      })
    });

    if (!response.ok) {
      return new Response(response.body, { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
