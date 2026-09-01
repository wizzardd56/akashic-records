export const runtime = "edge";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const MAX_SOURCE_CHARS = 12000;

function buildSystemPrompt(courseId: string | null): string {
  const courseContext = courseId
    ? `The user is studying "${courseId}". Tailor all responses to be relevant for this course/board.`
    : "";

  return `You are Akashic Copilot, an elite AI tutor for India's Official Statistical System under MoSPI (SIH 26101). ${courseContext}

You help with statistical methodologies, document analysis, quiz generation, and career guidance in data science/CS/cybersecurity. Be precise, professional, and insightful. When generating quizzes, provide exactly 3 options per question with a correct answer and explanation.`;
}

function truncateSource(content: string): string {
  if (content.length <= MAX_SOURCE_CHARS) return content;
  return content.slice(0, MAX_SOURCE_CHARS) + "\n\n[Document truncated due to length]";
}

/* ─── Groq ──────────────────────────────────────────────────────── */
const GROQ_MODELS = ["gpt-oss-120b", "qwen/qwen3.6-27b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

async function callGroq(apiKey: string, messages: ChatMessage[]): Promise<string> {
  for (const model of GROQ_MODELS) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 2048 }),
      });
      if (!res.ok) { console.warn(`Groq ${model}: ${res.status}`); continue; }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    } catch (e: any) { console.warn(`Groq ${model}:`, e.message); continue; }
  }
  throw new Error("Groq: all models failed or unavailable");
}

/* ─── OpenAI ────────────────────────────────────────────────────── */
const OPENAI_MODELS = ["gpt-4o-mini", "gpt-3.5-turbo"];

async function callOpenAI(apiKey: string, messages: ChatMessage[]): Promise<string> {
  for (const model of OPENAI_MODELS) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 2048 }),
      });
      if (!res.ok) { console.warn(`OpenAI ${model}: ${res.status}`); continue; }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    } catch (e: any) { console.warn(`OpenAI ${model}:`, e.message); continue; }
  }
  throw new Error("OpenAI: all models failed or unavailable");
}

/* ─── Gemini ────────────────────────────────────────────────────── */
async function callGemini(apiKey: string, messages: ChatMessage[]): Promise<string> {
  let systemInstruction = "";
  const contents: { role: string; parts: { text: string }[] }[] = [];

  for (const msg of messages) {
    if (msg.role === "system") {
      systemInstruction = msg.content;
    } else {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }
  }

  if (contents.length > 0 && contents[0].role !== "user") {
    contents.unshift({ role: "user", parts: [{ text: "Hello" }] });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const body: any = {
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  };
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "unknown");
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 150)}`);
  }
  const data = await res.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (content) return content;
  throw new Error("Gemini returned empty response");
}

/* ─── Main handler ──────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return Response.json({ reply: "Error: Invalid JSON in request body." }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      return Response.json({ reply: "Error: Request body must be a JSON object." }, { status: 400 });
    }

    const messages = Array.isArray(body.messages) ? body.messages : undefined;
    const prompt = typeof body.prompt === "string" ? body.prompt : undefined;
    const sourceContent = typeof body.sourceContent === "string" ? truncateSource(body.sourceContent) : undefined;
    const mode = typeof body.mode === "string" ? body.mode : undefined;
    const courseId = typeof body.courseId === "string" ? body.courseId : undefined;

    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!groqKey && !openaiKey && !geminiKey) {
      return Response.json({
        reply: "Error: No API keys configured. Add GROQ_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY to .env.local"
      });
    }

    // Build messages
    const systemPrompt = buildSystemPrompt(courseId || null);
    const chatMessages: ChatMessage[] = [{ role: "system", content: systemPrompt }];

    if (mode === "summary" && sourceContent) {
      chatMessages.push({
        role: "user",
        content: `Summarize this document in 2-3 sentences. Be brief and concise.\n\n${sourceContent}`
      });
    } else if (mode === "quiz" && sourceContent) {
      const quizPrompt = prompt || `Generate 3 MCQs based on this document. Format each as:\nQUESTION: [text]\nOPTION A: [text]\nOPTION B: [text]\nOPTION C: [text]\nCORRECT: [A/B/C]\nEXPLANATION: [text]\nMake them progressively harder.`;
      chatMessages.push({ role: "user", content: `${quizPrompt}\n\nDocument:\n${sourceContent}` });
    } else if (mode === "chat" && sourceContent) {
      const userQuery = prompt || "Summarize this document";
      chatMessages.push({
        role: "user",
        content: `Answer based on this document:\n\n--- DOCUMENT ---\n${sourceContent}\n--- END ---\n\nQuestion: ${userQuery}`
      });
    } else if (messages && messages.length > 0) {
      const recent = messages.slice(-10);
      for (const msg of recent) {
        const role = (msg.role === "assistant" || msg.role === "system") ? msg.role : "user";
        const content = msg.content || msg.text || "";
        if (content.trim()) chatMessages.push({ role, content });
      }
    } else {
      chatMessages.push({ role: "user", content: prompt || "Hello, introduce yourself briefly." });
    }

    if (!chatMessages.some(m => m.role === "user")) {
      return Response.json({ reply: "Error: No valid message provided." });
    }

    // Try providers in order: Groq → OpenAI → Gemini
    const errors: string[] = [];

    if (groqKey) {
      try {
        const reply = await callGroq(groqKey, chatMessages);
        return Response.json({ reply, provider: "Groq" });
      } catch (e: any) { errors.push(`Groq: ${e.message}`); }
    }

    if (openaiKey) {
      try {
        const reply = await callOpenAI(openaiKey, chatMessages);
        return Response.json({ reply, provider: "OpenAI" });
      } catch (e: any) { errors.push(`OpenAI: ${e.message}`); }
    }

    if (geminiKey) {
      try {
        const reply = await callGemini(geminiKey, chatMessages);
        return Response.json({ reply, provider: "Gemini" });
      } catch (e: any) { errors.push(`Gemini: ${e.message}`); }
    }

    return Response.json({
      reply: `All AI providers failed:\n\n${errors.join("\n\n")}\n\nPlease check your API keys in .env.local.`
    });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return Response.json({ reply: `Error: ${error.message || "Failed to process request."}` });
  }
}
