import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    let apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === "undefined") {
      apiKey = "AIzaSyB2dgSAQqJlRrRvpVsf23FvVGsZK4jMwUo";
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";
    const systemPrompt = `
      You are HarvestHub Assistant, an expert agricultural assistant and chatbot for the HarvestHub platform.
      Your goal is to help farmers with practical advice on crops, pests, soil, and weather.
      
      Tone: Friendly, helpful, and professional. Use "Namaste" or similar warm greetings occasionally.
      Keep answers concise (under 150 words) unless detailed steps are needed.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nUser Question: ${question}` }] }
      ]
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Vercel AI Ask error:", error);
    return res.status(500).json({ error: "Failed to get answer from cloud AI natively." });
  }
}
