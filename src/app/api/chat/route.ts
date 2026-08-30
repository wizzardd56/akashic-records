import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, prompt, sourceContent, fileData, mimeType, mode } = body;

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                reply: "Error: GEMINI_API_KEY is missing from your Vercel Environment Variables. Please add it in your Vercel dashboard!"
            });
        }

        const ai = new GoogleGenAI({ apiKey });
        let contents: any;

        // Handle File Uploads (PDFs, TXTs, etc.) via Multimodal Base64
        if (fileData && mimeType) {
            const base64Data = fileData.includes(",") ? fileData.split(",")[1] : fileData;
            let instruction = "Provide a comprehensive, professional summary of this document for a government statistical officer under MoSPI.";

            if (mode === "quiz") {
                instruction = "Generate 1 clear multiple-choice question with 3 options based on this document.";
            } else if (prompt) {
                instruction = prompt;
            }

            // Correct SDK schema for inline data + prompt string
            contents = [
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                },
                instruction
            ];
        } else {
            // Handle Text Prompts, Copilot Drawer, and Source Q&A
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

            contents = promptText;
        }

        // Call Gemini 3.6 Flash using the official SDK
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: contents,
        });

        const reply = response.text || "Gemini generated an empty response.";
        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Gemini API SDK Error:", error);
        return NextResponse.json(
            { reply: `Gemini API Error: ${error.message || "Failed to process request."}` },
            { status: 200 }
        );
    }
}