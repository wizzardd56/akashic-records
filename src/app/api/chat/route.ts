import { NextResponse } from "next/server";

// THIS IS THE MAGIC LINE: Bypasses Vercel's strict 10-second timeout!
export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, prompt, sourceContent, fileData, mimeType, mode } = body;

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ reply: "API Key missing from environment variables." });
        }

        let parts: any[] = [];
        const safeSource = sourceContent || "";

        // 1. Handle Multimodal Files (Base64)
        if (fileData && mimeType) {
            const base64Data = fileData.includes(",") ? fileData.split(",")[1] : fileData;
            let safeMimeType = "text/plain";

            if (mimeType.includes("pdf")) safeMimeType = "application/pdf";
            else if (mimeType.includes("csv")) safeMimeType = "text/csv";
            else if (mimeType.includes("html")) safeMimeType = "text/html";

            let instruction = prompt || "Analyze this document.";
            if (mode === "summary") instruction = "Provide a comprehensive, professional summary of this document.";
            if (mode === "quiz") instruction = "Generate one multiple-choice question with 3 options based on this document.";

            parts = [
                { text: instruction },
                { inlineData: { mimeType: safeMimeType, data: base64Data } }
            ];
        } else {
            // 2. Handle Text Prompts & Chat
            let finalPrompt = prompt || (messages ? messages[messages.length - 1].content : "Hello");

            if (mode === "summary") {
                finalPrompt = `Summarize this text concisely:\n\n${safeSource.substring(0, 15000)}`;
            } else if (mode === "quiz") {
                finalPrompt = `Generate a quiz question from this text:\n\n${safeSource.substring(0, 15000)}`;
            } else if (safeSource) {
                finalPrompt = `Document Context:\n${safeSource.substring(0, 15000)}\n\nUser Question:\n${finalPrompt}`;
            } else {
                finalPrompt = `You are a helpful AI assistant for MoSPI. USER QUESTION:\n${finalPrompt}`;
            }

            parts = [{ text: finalPrompt }];
        }

        // 3. Raw Fetch to Gemini 1.5 Flash (Most stable multimodal model)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts }]
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.text();
            return NextResponse.json({ reply: `Google API Error: ${errorData}` });
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Processed successfully, but response was empty.";

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Server Error:", error);
        return NextResponse.json({ reply: `Server Crash: ${error.message}` });
    }
}