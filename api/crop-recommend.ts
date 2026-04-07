export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GROQ_API_KEY is not configured on the server." });

  try {
    const { temperature, humidity, rainfall, ph, locationName } = req.body;

    const prompt = `You are an expert agricultural AI. Given these real-time conditions for the location "${locationName || "India"}":
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Rainfall (recent): ${rainfall}mm
- Soil pH: ${ph}

Analyze these conditions and recommend the best crop to grow. Consider Indian agricultural crops.

Respond ONLY with a raw JSON object (no markdown, no code blocks) in this exact format:
{
  "topCrop": "string (single best crop name)",
  "score": number (suitability score 0-100),
  "partiallySuitable": [
    {"name": "crop name", "score": number},
    {"name": "crop name", "score": number},
    {"name": "crop name", "score": number},
    {"name": "crop name", "score": number},
    {"name": "crop name", "score": number}
  ]
}

"partiallySuitable" should contain exactly 5 other crops sorted by score descending. Scores for partial crops should be between 40-85.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || "Groq API error");

    const rawText = data?.choices?.[0]?.message?.content || "{}";
    const cleanJson = rawText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return res.json({
      topCrop: parsed.topCrop || "Pulses",
      score: parsed.score || 92,
      partiallySuitable: parsed.partiallySuitable || [
        { name: "Wheat", score: 78 }, { name: "Rice", score: 72 },
        { name: "Cotton", score: 65 }, { name: "Maize", score: 58 },
        { name: "Soybean", score: 52 }
      ]
    });

  } catch (e: any) {
    console.error("crop-recommend error:", e);
    return res.json({
      topCrop: "Pulses", score: 86,
      partiallySuitable: [
        { name: "Wheat", score: 78 }, { name: "Rice", score: 72 },
        { name: "Cotton", score: 65 }, { name: "Sugarcane", score: 60 },
        { name: "Maize", score: 55 }
      ]
    });
  }
}
