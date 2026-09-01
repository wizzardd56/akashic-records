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
        console.warn(`Model ${model} failed: ${response.status}`);
        continue; // try next model
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    } catch (e) {
      console.warn(`Model ${model} error:`, e);
      continue;
    }
  }
  throw new Error("All Groq models failed. Check your API key and model access.");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, prompt, sourceContent, mode, courseId } = body;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json({
        reply: "Error: GROQ_API_KEY is missing. Please add it to your environment variables."
      });
    }

    const systemPrompt = buildSystemPrompt(courseId || null);
    const chatMessages: ChatMessage[] = [{ role: "system", content: systemPrompt }];

    if (mode === "summary" && sourceContent) {
      chatMessages.push({
        role: "user",
        content: `Provide a comprehensive, professional summary of the following document. Highlight key concepts, data points, and actionable insights:\n\n${sourceContent}`
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
      for (const msg of messages) {
        chatMessages.push({
          role: msg.role || "user",
          content: msg.content || msg.text || ""
        });
      }
    } else {
      chatMessages.push({
        role: "user",
        content: prompt || "Hello, introduce yourself briefly."
      });
    }

    const reply = await callGroq(apiKey, chatMessages);
    return Response.json({ reply });

  } catch (error: any) {
    console.error("Groq API Error:", error);
    return Response.json({
      reply: `Error: ${error.message || "Failed to process request."}`
    });
  }
}
