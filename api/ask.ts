export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GROQ_API_KEY is not configured on the server." });

  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are HarvestHub Assistant, an expert agricultural assistant. Help farmers with practical advice on crops, pests, soil, and weather. Be friendly and concise (under 150 words). Start with a warm greeting like Namaste."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: data?.error?.message || "Groq API error", raw: data });
    }

    const answer = data?.choices?.[0]?.message?.content || "No response from AI.";
    return res.json({ answer });

  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Unknown server error" });
  }
}
