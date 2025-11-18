// Vercel serverless function handler
// Import the default handler from the server
// Note: Vercel will transpile this, but the server code needs to be built first
// The build command runs before Vercel processes API functions
import handler from "../dist/index.js";

export default handler;

