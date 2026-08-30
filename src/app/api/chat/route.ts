import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const latestMessage = messages[messages.length - 1]?.content || "Hello";

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ reply: "API key not configured in environment variables." });
        }

        const promptText = `You are Akashic Copilot, an elite AI assistant for India's Official Statistical System under MoSPI (Ministry of Statistics and Programme Implementation) for SIH 26101. Provide precise, professional, and insightful answers regarding statistical data, sampling, CPI/IIP calculations, GVA modeling, and data pipelines. User query: ${latestMessage}`;

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: promptText }],
                        },
                    ],
                }),
            }
        );

        const data = await geminiRes.json();
        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I am analyzing the MoSPI statistical database. How else can I assist your audit?";

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("Gemini Chat API Error:", error);
        return NextResponse.json(
            { reply: "Neural link recalibrating. Please check your API key configuration." },
            { status: 200 }
        );
    }
}