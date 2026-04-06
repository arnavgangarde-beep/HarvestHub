import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDSrnGpDYKjHICd5xLEkuWayxAWAUHx8Os";
  const model = "gemini-2.5-flash";

  const result: any = {
    timestamp: new Date().toISOString(),
    keyPrefix: apiKey.substring(0, 8) + "...",
    model,
    envKeyPresent: !!process.env.GEMINI_API_KEY,
    nodeVersion: process.version,
  };

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: "Say hello in one word."
    });
    result.status = "SUCCESS";
    result.response = response.text;
  } catch (e: any) {
    result.status = "FAILED";
    result.error = e?.message;
    result.errorStatus = e?.status;
    result.errorDetails = JSON.stringify(e);
  }

  return res.json(result);
}
