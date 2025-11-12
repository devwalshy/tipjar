import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./static";
// Check for required environment variables in production
if (process.env.NODE_ENV === "production") {
  const requiredEnvVars = ["SESSION_SECRET"];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    console.error(`Error: Missing required environment variables: ${missingEnvVars.join(", ")}`);
    console.error("Please set these variables in your deployment configuration.");
    process.exit(1);
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize the app - this must complete before handling requests
let initPromise: Promise<void> | null = null;

async function initializeApp() {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // Only enable the Vite dev server when actually running in development.
    const isDevelopment = process.env.NODE_ENV !== "production";

    if (isDevelopment) {
      const { setupVite } = await import("./vite");
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Only start server for local development (not in serverless environments)
    const isServerless = process.env.VERCEL || process.env.NETLIFY;
    
    if (!isServerless) {
      const port = parseInt(process.env.PORT || "5000", 10);
      const listenOptions: { port: number; host: string; reusePort?: boolean } = {
        port,
        host: "0.0.0.0",
      };

      if (process.platform !== "win32") {
        listenOptions.reusePort = true;
      }

      server.listen(listenOptions, () => {
        log(`serving on port ${port}`);
      });
    }
  })();

  return initPromise;
}

// Start initialization immediately
initializeApp();

// Export for Vercel serverless - wrap to ensure initialization completes
export default async function handler(req: Request, res: Response) {
  await initializeApp();
  return app(req, res);
}

// Also export the app for Netlify and other platforms
export { app };
