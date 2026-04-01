export default async function handler(req: any, res: any) {
  try {
    // Dynamically import the entire server module so any global require crashes get caught
    const { appPromise } = await import('../server');
    
    // Wait for the Express app to fully initialize
    const app = await appPromise;
    
    // Forward the request and response objects to Express
    return app(req, res);
  } catch (error: any) {
    console.error("Vercel Boot Error Caught via API Gateway:", error);
    
    // Explicit return of 500 error directly to user instead of native HTML crash
    return res.status(500).json({ 
      error: "Vercel Boot Error: " + String(error?.message || error),
      stack: String(error?.stack || ""),
      context: "This means your backend completely crashed on startup."
    });
  }
}

