export const runtime = "edge";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function buildSystemPrompt(courseId: string | null): string {
  const c = courseId ? `The user is studying "${courseId}". Tailor responses for this course.` : "";
  return `You are Akashic Copilot, an AI tutor for India's statistical system under MoSPI (SIH 26101). ${c} Be concise and helpful. When asked for quizzes, provide 3 MCQ options with correct answer and explanation.`;
}

/** Extract content from any model response — handles reasoning models and <think> tags */
function extractContent(data: any): string | null {
  const msg = data.choices?.[0]?.message;
  if (!msg) return null;
  let text = msg.content || msg.reasoning || "";
  text = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  return text || null;
}

/* ─── Groq (allam-2-7b confirmed working) ──────────────────────── */
async function callGroq(apiKey: string, messages: ChatMessage[]): Promise<string> {
  // Try models in order — allam-2-7b is the standard model that always works
  const models = ["allam-2-7b", "qwen/qwen3.6-27b", "openai/gpt-oss-20b"];
  for (const model of models) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 2048 }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const reply = extractContent(data);
      if (reply) return reply;
    } catch { continue; }
  }
  throw new Error("Groq: no models available");
}

/* ─── Gemini (gemini-flash-lite-latest confirmed working) ──────── */
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

  if (contents.length === 0 || contents[0].role !== "user") {
    contents.unshift({ role: "user", parts: [{ text: "Hello" }] });
  }

  // Try models in order
  const models = ["gemini-flash-lite-latest", "gemma-4-26b-a4b-it"];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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
      if (!res.ok) continue;
      const data = await res.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) return content;
    } catch { continue; }
  }
  throw new Error("Gemini: no models available");
}

/* ─── Main handler ──────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    let body: any;
    try { body = await req.json(); } catch {
      return Response.json({ reply: "Error: Invalid JSON." }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return Response.json({ reply: "Error: Invalid request body." }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!groqKey && !geminiKey) {
      return Response.json({
        reply: "Error: No API keys found. Make sure GROQ_API_KEY or GEMINI_API_KEY is set in frontend/.env.local and restart the dev server."
      });
    }

    // Build messages
    const chatMessages: ChatMessage[] = [
      { role: "system", content: buildSystemPrompt(body.courseId || null) }
    ];

    const mode = typeof body.mode === "string" ? body.mode : "";
    const prompt = typeof body.prompt === "string" ? body.prompt : "";
    const sourceContent = typeof body.sourceContent === "string"
      ? (body.sourceContent.length > 12000 ? body.sourceContent.slice(0, 12000) : body.sourceContent)
      : "";
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (mode === "summary" && sourceContent) {
      chatMessages.push({ role: "user", content: `Summarize in 2-3 sentences:\n\n${sourceContent}` });
    } else if (mode === "quiz" && sourceContent) {
      chatMessages.push({ role: "user", content: `Generate 3 MCQs. Format each:\nQUESTION: [text]\nOPTION A: [text]\nOPTION B: [text]\nOPTION C: [text]\nCORRECT: [A/B/C]\nEXPLANATION: [text]\n\nDocument:\n${sourceContent}` });
    } else if (mode === "chat" && sourceContent) {
      chatMessages.push({ role: "user", content: `Answer based on this document:\n---\n${sourceContent}\n---\n\nQuestion: ${prompt || "Summarize this"}` });
    } else if (messages.length > 0) {
      for (const msg of messages.slice(-10)) {
        const role = (msg.role === "assistant" || msg.role === "system") ? msg.role : "user";
        const content = msg.content || msg.text || "";
        if (content.trim()) chatMessages.push({ role, content });
      }
    } else {
      chatMessages.push({ role: "user", content: prompt || "Hello, who are you?" });
    }

    // Try providers
    if (groqKey) {
      try {
        const reply = await callGroq(groqKey, chatMessages);
        return Response.json({ reply });
      } catch {}
    }

    if (geminiKey) {
      try {
        const reply = await callGemini(geminiKey, chatMessages);
        return Response.json({ reply });
      } catch {}
    }

    return Response.json({
      reply: "Error: All providers failed. Please restart the dev server and check that your API keys are correct in frontend/.env.local"
    });

  } catch (error: any) {
    return Response.json({ reply: `Error: ${error.message || "Unknown error"}` });
  }
}
