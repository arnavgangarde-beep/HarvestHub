export default async function handler(req: any, res: any) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const model = "gemini-1.5-flash";

  const result: any = {
    timestamp: new Date().toISOString(),
    keyPrefix: apiKey.substring(0, 8) + "...",
    model,
    envKeyPresent: !!process.env.GEMINI_API_KEY,
    nodeVersion: process.version,
    sdkUsed: "fetch (no SDK)",
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Say hello in one word." }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      result.status = "FAILED";
      result.httpStatus = response.status;
      result.error = data?.error?.message;
      result.raw = data;
    } else {
      result.status = "SUCCESS";
      result.response = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    }
  } catch (e: any) {
    result.status = "CRASHED";
    result.error = e?.message;
  }

  return res.json(result);
}
