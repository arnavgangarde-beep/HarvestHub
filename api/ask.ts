export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
  const model = "gemini-2.0-flash";

  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const systemPrompt = `You are HarvestHub Assistant, an expert agricultural assistant. Help farmers with practical advice on crops, pests, soil, and weather. Be friendly and concise (under 150 words). Start with a warm greeting like Namaste.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\nUser Question: ${question}` }] }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data?.error?.message || "Gemini API error", raw: data });
    }

    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
    return res.json({ answer });

  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Unknown server error" });
  }
}
