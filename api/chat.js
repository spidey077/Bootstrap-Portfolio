export const config = {
  runtime: 'edge',
};

// --- CACHE & CONFIG ---
let cachedFacts = "";
let lastFetchTime = 0;
const CACHE_DURATION = 300000; // 5 minutes in milliseconds
const GOOGLE_SHEET_CSV_URL = process.env.GOOGLE_SHEET_CSV_URL;

// Simple CSV parser for "Key, Value" or "Fact" rows
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  return lines
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('Key,Value')) // Skip header if exists
    .map(line => {
      // Basic CSV split - handles simple rows. 
      // If client uses commas inside text, they should use "quotes"
      return `- ${line.replace(/,/g, ': ')}`; 
    })
    .join('\n');
}

async function getDynamicFacts() {
  if (!GOOGLE_SHEET_CSV_URL) return "";

  const now = Date.now();
  if (cachedFacts && (now - lastFetchTime < CACHE_DURATION)) {
    console.log("Using cached facts");
    return cachedFacts;
  }

  try {
    console.log("Fetching fresh facts from Google Sheets...");
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    if (!response.ok) throw new Error("Failed to fetch sheet");
    
    const csvText = await response.text();
    cachedFacts = parseCSV(csvText);
    lastFetchTime = now;
    return cachedFacts;
  } catch (error) {
    console.error("Error fetching dynamic facts:", error);
    return cachedFacts || ""; // Fallback to cache if available
  }
}

// In-memory rate limiting map
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
      userLimit.count = 1;
      userLimit.startTime = now;
    } else {
      userLimit.count++;
      if (userLimit.count > MAX_REQUESTS_PER_WINDOW) {
        return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), { status: 429 });
      }
    }
    ipRateLimitMap.set(ip, userLimit);
  }

  try {
    const { messages } = await req.json();

    // 1. Fetch Dynamic Facts from Google Sheets
    const dynamicFacts = await getDynamicFacts();

    // 2. LEAD CAPTURE LOGIC (Discord)
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
        const match = lastMessage.content.match(emailRegex);
        if (match && DISCORD_WEBHOOK_URL) {
          const email = match[0];
          const context = messages.slice(-3).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
          fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: `**🚨 NEW LEAD! 🚨**\n**Email:** \`${email}\`\n\n**Context:**\n\`\`\`text\n${context}\n\`\`\``
            })
          }).catch(e => console.error("Webhook Error", e));
        }
      }
    }

    const systemPrompt = {
      role: "system",
      content: `
You are a chatbot for Imdadullah's portfolio.

CORE INFO:
- Imdadullah is a frontend developer (2+ years exp).
- Tech: HTML, CSS, JS, React, Next.js, Tailwind, GSAP.
- Specializes in: Business sites, landing pages, custom chatbots.
- Contact: WhatsApp +92 3318962777, Email: imdadullahchishti@gmail.com.

LATEST UPDATES & FAQS (From Live Sheet):
${dynamicFacts || "No additional updates at the moment."}

RULES:
- Answer only based on the info above.
- Be short and clear (max 2 sentences).
- If asked to hire/start project: Ask for their email or give WhatsApp.
- If unsure: Ask for their email so Imdadullah can reply manually.
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

    if (!response.ok) return new Response(response.body, { status: response.status });

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
