import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, prompt, sourceContent, fileData, mimeType, mode } = body;

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ reply: "API key not configured in environment variables." });
        }

        let contentsPayload: any = [];

        // If a file (PDF/Text) was uploaded as base64, send it directly to Gemini natively
        if (fileData && mimeType) {
            const base64Data = fileData.includes(",") ? fileData.split(",")[1] : fileData;

            let instruction = "Provide a comprehensive, professional summary of this document for a government statistical officer under MoSPI.";
            if (mode === "quiz") {
                instruction = "Generate 1 clear multiple-choice question with 3 options based on this document.";
            } else if (prompt) {
                instruction = prompt;
            }

            contentsPayload = [
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Data
                    }
                },
                {
                    text: instruction
                }
            ];
        } else {
            // Standard Text / Copilot Chat / Source Q&A
            let promptText = "";
            if (sourceContent || mode) {
                const latestPrompt = prompt || "Analyze this source";
                if (mode === "summary") {
                    promptText = `You are an expert document summarizer for MoSPI. Provide a detailed, professional summary of the following document source:\n\n${sourceContent}`;
                } else if (mode === "quiz") {
                    promptText = `You are an expert quiz generator. Generate a clear multiple-choice question with 3 options based on this source text:\n\n${sourceContent}`;
                } else {
                    promptText = `You are an expert AI assistant for MoSPI analyzing source documents. Context / Source Material: "${sourceContent}"\n\nUser Query: ${latestPrompt}`;
                }
            } else {
                const latestMessage = (messages && messages.length > 0)
                    ? (messages[messages.length - 1]?.content || "Hello")
                    : (prompt || "Hello");

                promptText = `You are Akashic Copilot, an elite AI assistant for India's Official Statistical System under MoSPI (Ministry of Statistics and Programme Implementation) for SIH 26101. Provide precise, professional, and insightful answers regarding statistical data, sampling, CPI/IIP calculations, GVA modeling, and data pipelines. User query: ${latestMessage}`;
            }

            contentsPayload = [{ parts: [{ text: promptText }] }];
        }

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: contentsPayload,
                }),
            }
        );

        const data = await geminiRes.json();
        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I am analyzing the document contents. How else can I assist your audit?";

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { reply: "Neural link recalibrating. Failed to parse document source." },
            { status: 200 }
        );
    }
}