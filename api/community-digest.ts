export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GROQ_API_KEY is not configured." });

  const { topics } = req.body as { topics?: string[] };

  const topicList = (topics ?? [
    "wheat prices rising due to export demand",
    "pink bollworm infestation in cotton",
    "unseasonal rainfall warning in AP for paddy",
    "AI-based irrigation reducing water usage by 40%",
    "onion price volatility at Nashik mandi",
  ]).join("; ");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are HarvestHub's AI community analyst. Given a list of trending topics from an Indian farmer community this week, produce a structured Weekly Digest in JSON format. Return ONLY valid JSON with this exact shape: { \"headline\": \"string (max 12 words)\", \"summary\": \"string (2-3 sentences, max 60 words)\", \"topThreats\": [{ \"crop\": \"string\", \"threat\": \"string\", \"severity\": \"low|medium|high\" }], \"topOpportunities\": [\"string\", \"string\", \"string\"], \"weeklyTip\": \"string (1 sentence actionable tip)\" }. Be concise, practical, and India-focused.",
          },
          {
            role: "user",
            content: `This week's trending community topics: ${topicList}`,
          },
        ],
        temperature: 0.5,
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: data?.error?.message || "Groq API error" });
    }

    const raw = data?.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    return res.json(parsed);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Unknown server error" });
  }
}
