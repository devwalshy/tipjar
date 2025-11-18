import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  // In serverless environments (Vercel/Netlify), static files are served by the platform
  // Only serve static files when running in a traditional server environment
  const isServerless = process.env.VERCEL || process.env.NETLIFY;
  
  if (isServerless) {
    // In serverless, Vercel/Netlify serve static files automatically
    // Only handle API routes and fallback to index.html for client-side routing
    app.use("*", (req, res, next) => {
      // If it's an API route, let it pass through
      if (req.path.startsWith("/api")) {
        return next();
      }
      // For non-API routes, this should be handled by the platform's rewrites
      // But we provide a fallback in case
      res.status(404).json({ message: "Not found" });
    });
    return;
  }

  // For traditional server deployments, serve static files
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    log(`Build directory not found: ${distPath}. Serving API only.`);
    // Just serve a simple message for API-only mode
    app.use("*", (_req, res) => {
      res.json({ message: "TipJar API is running" });
    });
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

