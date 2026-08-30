import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, prompt, sourceContent, fileData, mimeType, mode } = body;

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                reply: "Error: GEMINI_API_KEY is missing from your Vercel Environment Variables."
            });
        }

        let parts: any[] = [];

        // 1. Handle Multimodal File Uploads (PDFs, TXTs, CSVs)
        if (fileData && mimeType) {
            const base64Data = fileData.includes(",") ? fileData.split(",")[1] : fileData;

            // Gemini throws INVALID_ARGUMENT if the mimeType isn't perfectly matched.
            // We force all unsupported types to 'text/plain' to guarantee it parses.
            let safeMimeType = "text/plain";
            if (mimeType.includes("pdf")) safeMimeType = "application/pdf";
            else if (mimeType.includes("csv")) safeMimeType = "text/csv";
            else if (mimeType.includes("html")) safeMimeType = "text/html";
            else if (mimeType.includes("xml")) safeMimeType = "text/plain";

            let instruction = "Provide a comprehensive, professional summary of this document for a government statistical officer under MoSPI.";

            if (mode === "quiz") {
                instruction = "Generate 1 clear multiple-choice question with 3 options based on this document.";
            } else if (prompt) {
                instruction = prompt;
            }

            parts = [
                { text: instruction },
                {
                    inlineData: {
                        mimeType: safeMimeType,
                        data: base64Data
                    }
                }
            ];
        }
        // 2. Handle Text Prompts, Copilot Drawer, and Source Q&A
        else {
            let promptText = "";
            if (sourceContent || mode) {
                const latestPrompt = prompt || "Analyze this source";
                if (mode === "summary") {
                    promptText = `You are an expert document summarizer. Summarize this:\n\n${sourceContent}`;
                } else if (mode === "quiz") {
                    promptText = `Generate a clear multiple-choice question with 3 options based on this text:\n\n${sourceContent}`;
                } else {
                    promptText = `Context / Source Material: "${sourceContent}"\n\nUser Query: ${latestPrompt}`;
                }
            } else {
                const latestMessage = (messages && messages.length > 0)
                    ? (messages[messages.length - 1]?.content || "Hello")
                    : (prompt || "Hello");

                promptText = `You are an elite AI assistant for MoSPI. User query: ${latestMessage}`;
            }

            parts = [{ text: promptText }];
        }

        // 3. Raw REST API Call (Bypassing SDK completely for 100% stability)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: parts }]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini REST API Error:", data);
            return NextResponse.json({
                reply: `API Error: ${data.error?.message || "Failed to process request."}`
            });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini generated an empty response.";
        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Server Error:", error);
        return NextResponse.json(
            { reply: `Server Error: ${error.message}` },
            { status: 200 }
        );
    }
}