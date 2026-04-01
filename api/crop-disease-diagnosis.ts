import { GoogleGenAI } from "@google/genai";

// Natively exported Vercel Serverless Function
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { 
      image, 
      cropType, growthStage, affectedParts, symptomDuration, spreadPattern, weather, irrigation, soilType, recentFertilizer, recentPesticide 
    } = req.body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: "No image provided or invalid format." });
    }

    // Convert data URL (data:image/jpeg;base64,....) to base64
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let mimeType = "image/jpeg";
    let imageBase64 = image;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      imageBase64 = matches[2];
    }

    let apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    // Fallback for Vercel deployments
    if (!apiKey || apiKey === "undefined") {
      apiKey = "AIzaSyB2dgSAQqJlRrRvpVsf23FvVGsZK4jMwUo";
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert agricultural pathologist. A farmer has uploaded an image of a diseased crop. Analyze both the visual symptoms in the image and the following field parameters:

- Crop Type: ${cropType || "Unknown"}
- Growth Stage: ${growthStage || "Unknown"}
- Affected Plant Part(s): ${affectedParts || "Unknown"}
- Symptom Onset Duration: ${symptomDuration || "Unknown"}
- Spread Pattern: ${spreadPattern || "Unknown"}
- Recent Weather: ${weather || "Unknown"}
- Irrigation Method: ${irrigation || "Unknown"}
- Soil Type: ${soilType || "Unknown"}
- Recent Fertilizer Use: ${recentFertilizer || "None reported"}
- Recent Pesticide/Fungicide Use: ${recentPesticide || "None reported"}

Respond ONLY with a raw JSON object (no markdown, no code blocks) in this exact format:
{
  "diseaseName": "Common name of the disease",
  "scientificName": "Scientific/pathogen name",
  "confidence": "High" or "Medium" or "Low",
  "category": "Fungal" or "Bacterial" or "Viral" or "Pest-induced" or "Nutritional Deficiency" or "Environmental Stress",
  "severity": "Mild" or "Moderate" or "Severe" or "Critical",
  "cropLossRisk": "Estimated % crop loss if untreated, e.g. 20-30%",
  "spreadLikely": "Yes / No / Conditionally - with brief reason",
  "symptoms": ["symptom 1 observed", "symptom 2 observed"],
  "treatment": {
    "immediate": ["step 1"],
    "chemical": ["fungicide/pesticide with dosage"],
    "organic": ["neem oil"],
    "soilWater": ["irrigation adjustment"]
  },
  "prevention": ["crop rotation advice"],
  "followUp": ["7-day check items"],
  "weatherAdvice": ["weather-specific spraying advice"]
}

Use simple, farmer-friendly language. Be specific with quantities.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data: imageBase64 } },
            { text: prompt }
          ]
        }
      ],
      config: { temperature: 0.3 }
    });

    const rawText = response.text || "{}";
    const cleanJson = rawText.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    return res.status(200).json({
      diseaseName: parsed.diseaseName || "Unknown Disease",
      scientificName: parsed.scientificName || "",
      confidence: parsed.confidence || "Medium",
      category: parsed.category || "Unknown",
      severity: parsed.severity || "Moderate",
      cropLossRisk: parsed.cropLossRisk || "10-20%",
      spreadLikely: parsed.spreadLikely || "Conditionally",
      symptoms: parsed.symptoms || [],
      treatment: parsed.treatment || { immediate: [], chemical: [], organic: [], soilWater: [] },
      prevention: parsed.prevention || [],
      followUp: parsed.followUp || [],
      weatherAdvice: parsed.weatherAdvice || []
    });

  } catch (error: any) {
    console.error("Native Vercel Serverless Error:", error);
    return res.status(500).json({ 
      error: "Analysis failed natively on Vercel: " + String(error.message) 
    });
  }
}
