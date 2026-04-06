import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDSrnGpDYKjHICd5xLEkuWayxAWAUHx8Os";

  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = `You are HarvestHub Assistant, an expert agricultural assistant. Help farmers with practical advice on crops, pests, soil, and weather. Be friendly and concise (under 150 words).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nUser Question: ${question}` }] }
      ]
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error("[API/ask] Error:", error?.message, error?.status, error?.statusInfo);
    return res.status(500).json({
      error: error?.message || "Unknown error",
      status: error?.status,
      keyUsed: apiKey.substring(0, 8) + "...",
      model: "gemini-2.5-flash"
    });
  }
}
