import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, prompt, sourceContent, mode } = body;

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ reply: "API Key missing from environment variables." });
        }

        // 1. Determine the user's actual question
        const userText = prompt || (messages && messages.length > 0 ? messages[messages.length - 1].content : "Hello");
        const safeSource = sourceContent || "";

        // 2. Build a strictly text-based prompt (Zero-crash method)
        let finalPrompt = "";

        if (mode === "summary") {
            finalPrompt = `Summarize this text concisely:\n\n${safeSource.substring(0, 15000)}`;
        } else if (mode === "quiz") {
            finalPrompt = `Generate one multiple-choice question with 3 options based on this text:\n\n${safeSource.substring(0, 15000)}`;
        } else if (safeSource.trim().length > 0 && !safeSource.startsWith("data:")) {
            finalPrompt = `You are an AI assistant analyzing a document.\n\nDOCUMENT TEXT:\n${safeSource.substring(0, 15000)}\n\nUSER QUESTION:\n${userText}`;
        } else {
            finalPrompt = `You are a helpful AI assistant for MoSPI. USER QUESTION:\n${userText}`;
        }

        // 3. The exact, strict schema Gemini 3.6 Flash demands for text
        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: finalPrompt }]
                }
            ]
        };

        // 4. Raw REST call
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            return NextResponse.json({ reply: `API Error: ${data.error?.message || "Unknown error"}` });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I processed the request, but the response was empty.";
        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Server Error:", error);
        return NextResponse.json({ reply: `Server Crash: ${error.message}` });
    }
}