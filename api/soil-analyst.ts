export default async function handler(req: any, res: any) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey)
    return res.status(500).json({ error: "GROQ_API_KEY is not configured on the server." });

  try {
    const { N, P, K, pH, temperature, humidity, rainfall, soilTexture } = req.body;

    // Basic validation
    if ([N, P, K, pH, temperature, humidity, rainfall].some(v => v === undefined || v === null || v === "")) {
      return res.status(400).json({ error: "All soil parameters (N, P, K, pH, Temperature, Humidity, Rainfall) are required." });
    }

    const nVal = Number(N), pVal = Number(P), kVal = Number(K);
    const phVal = Number(pH), tempVal = Number(temperature);
    const humVal = Number(humidity), rainVal = Number(rainfall);

    // Extreme pH guard — soil treatment first
    const extremePh = phVal < 4.5 || phVal > 8.5;

    const INDIAN_CROPS = [
      "Rice", "Maize", "Chickpea", "Kidney Beans", "Pigeon Peas", "Moth Beans",
      "Mung Bean", "Blackgram", "Lentil", "Pomegranate", "Banana", "Mango",
      "Grapes", "Watermelon", "Muskmelon", "Apple", "Orange", "Papaya",
      "Coconut", "Cotton", "Jute", "Coffee", "Wheat", "Sugarcane", "Soybean", "Groundnut"
    ];

    const prompt = `You are the HarvestHub AI Soil Analyst, an expert agronomist and data scientist specializing in Indian agriculture and soil health. Analyze the following soil parameters and provide actionable recommendations.

SOIL PARAMETERS:
- Nitrogen (N): ${nVal} mg/kg
- Phosphorus (P): ${pVal} mg/kg
- Potassium (K): ${kVal} mg/kg
- pH Level: ${phVal}
- Temperature: ${tempVal}°C
- Humidity: ${humVal}%
- Rainfall: ${rainVal} mm
- Soil Texture/Color: ${soilTexture || "Not specified"}

IMPORTANT RULES:
1. ${extremePh ? "CRITICAL: pH is extreme (outside 4.5–8.5 range). Prioritize soil treatment advice FIRST before crop suggestions." : "pH is within acceptable range."}
2. Only recommend crops from this Indian crop list: ${INDIAN_CROPS.join(", ")}.
3. For each recommended crop, provide a realistic Confidence Score (%) based on how well the soil parameters match ideal conditions for that crop.
4. Be specific with fertilizer names (e.g., "Urea", "DAP", "MOP", "SSP") and dosages in kg/acre.
5. Use farmer-friendly, encouraging language.

Respond ONLY with a raw JSON object (no markdown, no code blocks, no explanation) in this exact format:
{
  "soilStatus": "string — 2–3 sentence summary of overall soil nutrient health, noting any deficiencies or excesses",
  "phAlert": ${extremePh ? '"string — critical pH treatment advice (liming for acidic, gypsum/sulfur for alkaline)"' : 'null'},
  "npkAnalysis": {
    "nitrogen": { "level": "Low|Optimal|High", "value": ${nVal}, "advice": "string" },
    "phosphorus": { "level": "Low|Optimal|High", "value": ${pVal}, "advice": "string" },
    "potassium": { "level": "Low|Optimal|High", "value": ${kVal}, "advice": "string" }
  },
  "topCrops": [
    { "name": "string", "confidence": number, "reason": "string — 1 sentence why this crop suits these conditions", "expectedYield": "string e.g. 25-30 qtl/acre" },
    { "name": "string", "confidence": number, "reason": "string", "expectedYield": "string" },
    { "name": "string", "confidence": number, "reason": "string", "expectedYield": "string" }
  ],
  "optimizationSteps": [
    { "step": 1, "category": "Fertilizer", "action": "string — specific fertilizer with name, quantity per acre, and timing" },
    { "step": 2, "category": "Soil Treatment", "action": "string — pH or texture correction if needed" },
    { "step": 3, "category": "Irrigation", "action": "string — irrigation schedule and method" },
    { "step": 4, "category": "Monitoring", "action": "string — what to check and when" }
  ],
  "sustainabilityNote": "string — one tip on reducing carbon footprint or using organic/natural methods",
  "overallScore": number
}

Ensure topCrops are sorted by confidence score descending. Confidence scores must be realistic (not all 95%+). overallScore is 0–100 representing overall soil health.`;

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
            content: "You are HarvestHub AI Soil Analyst, an expert agronomist specializing in Indian agriculture. Always respond with valid raw JSON only — no markdown, no code fences."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.4
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || "Groq API error");
    }

    const rawText = data?.choices?.[0]?.message?.content || "{}";
    const cleanJson = rawText.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    return res.status(200).json({
      soilStatus: parsed.soilStatus || "Soil analysis complete.",
      phAlert: parsed.phAlert || null,
      npkAnalysis: parsed.npkAnalysis || {
        nitrogen: { level: "Optimal", value: nVal, advice: "Maintain current levels." },
        phosphorus: { level: "Optimal", value: pVal, advice: "Maintain current levels." },
        potassium: { level: "Optimal", value: kVal, advice: "Maintain current levels." }
      },
      topCrops: parsed.topCrops || [
        { name: "Wheat", confidence: 78, reason: "Suitable for current conditions.", expectedYield: "20-25 qtl/acre" },
        { name: "Rice", confidence: 71, reason: "Moderate match for humidity levels.", expectedYield: "18-22 qtl/acre" },
        { name: "Maize", confidence: 65, reason: "Good temperature match.", expectedYield: "15-20 qtl/acre" }
      ],
      optimizationSteps: parsed.optimizationSteps || [],
      sustainabilityNote: parsed.sustainabilityNote || "Consider integrating green manure crops like Dhaincha or Sunhemp in fallow periods.",
      overallScore: parsed.overallScore ?? 70
    });

  } catch (error: any) {
    console.error("soil-analyst error:", error?.message);
    return res.status(500).json({ error: "Soil analysis failed: " + String(error?.message) });
  }
}
