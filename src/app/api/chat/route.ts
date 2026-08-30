import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client using server environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const latestMessage = messages[messages.length - 1]?.content || "Hello";

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `You are Akashic Copilot, an elite AI assistant for India's Official Statistical System under MoSPI (Ministry of Statistics and Programme Implementation) for SIH 26101. Provide precise, professional, and insightful answers regarding statistical data, sampling, CPI/IIP calculations, GVA modeling, and data pipelines. User query: ${latestMessage}`
                        }
                    ]
                }
            ],
        });

        const reply = response.text || "I am analyzing the MoSPI statistical database. How else can I assist your audit?";

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("Gemini Chat API Error:", error);
        return NextResponse.json(
            { reply: "Neural link recalibrating. (Ensure GEMINI_API_KEY is configured in your environment variables)." },
            { status: 200 }
        );
    }
}