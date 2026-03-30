import { appPromise } from '../server';

export default async function handler(req: any, res: any) {
  // Wait for the Express app to fully initialize
  const app = await appPromise;
  
  // Forward the request and response objects to Express
  return app(req, res);
}
