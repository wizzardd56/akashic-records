export const runtime = "edge";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Models in priority order — first one that works wins
const GROQ_MODELS = [
  "gpt-oss-120b",
  "qwen/qwen3.6-27b",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

// Max characters for source content to avoid Groq token limits
const MAX_SOURCE_CHARS = 12000;

function buildSystemPrompt(courseId: string | null): string {
  const courseContext = courseId
    ? `The user is studying "${courseId}". Tailor all responses, examples, and quiz questions to be relevant and age-appropriate for this course/board.`
    : "";

  return `You are Akashic Copilot, an elite AI tutor and knowledge assistant for India's Official Statistical System under MoSPI (Ministry of Statistics and Programme Implementation) for SIH 26101. ${courseContext}

You help with:
- Statistical methodologies (sampling, CPI/IIP, GVA modeling, SNA 2008)
- Document analysis, summarization, and key insight extraction
- Generating quiz questions and practice MCQs from study material
- Answering follow-up questions about uploaded documents
- Providing career guidance related to data science, cybersecurity, and CS fields

Be precise, professional, and insightful. Use clear formatting. When generating quizzes, always provide exactly 3 options per question with a correct answer and explanation.`;
}

async function callGroq(apiKey: string, messages: ChatMessage[]): Promise<string> {
  const errors: string[] = [];

  for (const model of GROQ_MODELS) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text().catch(() => "unknown");
        const detail = `${model}: ${response.status} - ${errBody.slice(0, 100)}`;
        errors.push(detail);
        console.warn(`Groq model ${model} failed:`, detail);
        continue; // try next model
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
      errors.push(`${model}: returned empty content`);
    } catch (e: any) {
      const detail = `${model}: ${e.message || "network error"}`;
      errors.push(detail);
      console.warn(`Groq model ${model} error:`, detail);
      continue;
    }
  }

  // All models failed — return detailed error
  const errorList = errors.join("\n");
  throw new Error(`All Groq models failed. Details:\n${errorList}`);
}

/** Truncate source content to avoid token limits */
function truncateSource(content: string): string {
  if (content.length <= MAX_SOURCE_CHARS) return content;
  return content.slice(0, MAX_SOURCE_CHARS) + "\n\n[Document truncated due to length]";
}

/** Validate and sanitize incoming request body */
function parseRequestBody(body: any): {
  messages?: any[];
  prompt?: string;
  sourceContent?: string;
  mode?: string;
  courseId?: string;
} {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object");
  }

  return {
    messages: Array.isArray(body.messages) ? body.messages : undefined,
    prompt: typeof body.prompt === "string" ? body.prompt : undefined,
    sourceContent: typeof body.sourceContent === "string" ? truncateSource(body.sourceContent) : undefined,
    mode: typeof body.mode === "string" ? body.mode : undefined,
    courseId: typeof body.courseId === "string" ? body.courseId : undefined,
  };
}

export async function POST(req: Request) {
  try {
    // Parse request body with error handling
    let body: any;
    try {
      body = await req.json();
    } catch {
      return Response.json(
        { reply: "Error: Invalid JSON in request body. Please check your request format." },
        { status: 400 }
      );
    }

    const { messages, prompt, sourceContent, mode, courseId } = parseRequestBody(body);

    // Validate API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json({
        reply: "Error: GROQ_API_KEY is not configured. Please add it to your .env.local file:\n\nGROQ_API_KEY=your_key_here\n\nGet a free key at https://console.groq.com/keys"
      });
    }

    const systemPrompt = buildSystemPrompt(courseId || null);
    const chatMessages: ChatMessage[] = [{ role: "system", content: systemPrompt }];

    if (mode === "summary" && sourceContent) {
      chatMessages.push({
        role: "user",
        content: `Summarize this document in 2-3 sentences. Be brief and concise. Only mention the most important points.\n\n${sourceContent}`
      });
    } else if (mode === "quiz" && sourceContent) {
      const quizPrompt = prompt || `Generate 3 challenging multiple-choice questions based strictly on this document. For each question, use this exact format:

QUESTION: [question text]
OPTION A: [first option]
OPTION B: [second option]
OPTION C: [third option]
CORRECT: [A, B, or C]
EXPLANATION: [brief explanation]

Repeat for all 3 questions. Make them progressively harder.`;
      chatMessages.push({
        role: "user",
        content: `${quizPrompt}\n\nDocument content:\n${sourceContent}`
      });
    } else if (mode === "chat" && sourceContent) {
      const userQuery = prompt || "Summarize this document";
      chatMessages.push({
        role: "user",
        content: `You have been given a document as context. Answer the user's question based on this document.\n\n--- DOCUMENT ---\n${sourceContent}\n--- END DOCUMENT ---\n\nUser Question: ${userQuery}`
      });
    } else if (messages && messages.length > 0) {
      // Multi-message conversation (copilot) — only include last 10 messages to stay within token limits
      const recentMessages = messages.slice(-10);
      for (const msg of recentMessages) {
        const role = (msg.role === "assistant" || msg.role === "system") ? msg.role : "user";
        const content = msg.content || msg.text || "";
        if (content.trim()) {
          chatMessages.push({ role, content });
        }
      }
    } else {
      chatMessages.push({
        role: "user",
        content: prompt || "Hello, introduce yourself briefly."
      });
    }

    // Validate we have at least one user message
    const hasUserMessage = chatMessages.some(m => m.role === "user");
    if (!hasUserMessage) {
      return Response.json({
        reply: "Error: No valid message content provided. Please enter a question or upload a document."
      });
    }

    const reply = await callGroq(apiKey, chatMessages);
    return Response.json({ reply });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return Response.json({
      reply: `Error: ${error.message || "Failed to process request."}`
    });
  }
}
