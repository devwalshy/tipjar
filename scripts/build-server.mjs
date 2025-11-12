import { build } from "esbuild";

const defineNodeEnv = JSON.stringify(process.env.NODE_ENV ?? "production");

async function run() {
  try {
    await build({
      entryPoints: ["server/index.ts"],
      outdir: "dist",
      bundle: true,
      format: "esm",
      platform: "node",
      target: ["node20"],
      packages: "external",
      splitting: true,
      sourcemap: false,
      define: {
        "process.env.NODE_ENV": defineNodeEnv,
      },
      logLevel: "info",
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
