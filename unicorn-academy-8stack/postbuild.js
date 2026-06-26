/**
 * postbuild.js — Bundles the React Router SSR server into _worker.js
 * for Cloudflare Pages deployment.
 *
 * This script runs after `react-router build` and:
 * 1. Reads build/server/index.js (React Router SSR server)
 * 2. Creates build/client/_worker.js that wraps it with Cloudflare Pages handler
 *
 * Cloudflare Pages detects _worker.js and uses it as the edge function.
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

const serverBundle = join(__dirname, "build", "server", "worker.js");
const workerOutput = join(__dirname, "build", "client", "_worker.js");
const workerEntry = join(__dirname, "worker-entry.js");

if (!existsSync(serverBundle)) {
  console.error("❌ build/server/index.js not found. Run `npm run build` first.");
  process.exit(1);
}

const entryContent = `
import { createPagesFunctionHandler } from "@react-router/cloudflare";
import * as build from "./build/server/worker.js";

const handler = createPagesFunctionHandler({
  build,
  getLoadContext({ context }) {
    return { cloudflare: context };
  },
});

export default {
  async fetch(request, env, ctx) {
    // 1. Try to serve static assets first (SPA Client-side files)
    try {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    } catch (e) {}

    // 2. Fall back to React Router API / SSR
    globalThis.CF_ENV = env;
    return handler({
      request,
      env,
      ctx,
      context: { env, ctx },
    });
  },
};
`.trim();

writeFileSync(workerEntry, entryContent, "utf-8");
console.log("📝 Created worker entry...");

// Bundle with wrangler
try {
  console.log("📦 Bundling SSR worker with Wrangler...");
  execSync(
    `npx wrangler deploy --dry-run --outfile build/client/_worker.js --no-bundle worker-entry.js --compatibility-date 2025-05-26 --compatibility-flags nodejs_compat`,
    { stdio: "inherit" }
  );
} catch (e) {
  // Fallback: use esbuild directly
  console.log("⚠️ Wrangler bundle failed, trying esbuild...");
  try {
    execSync(
      `npx esbuild worker-entry.js --bundle --outfile=build/client/_worker.js --format=esm --platform=browser --external:__STATIC_CONTENT_MANIFEST`,
      { stdio: "inherit" }
    );
  } catch (e2) {
    // Last resort: inline everything manually
    console.log("⚠️ esbuild failed too, creating inline worker...");
    const serverCode = readFileSync(serverBundle, "utf-8");
    const workerCode = `
${serverCode}

import { createPagesFunctionHandler } from "@react-router/cloudflare";
const handler = createPagesFunctionHandler({ build: exports });
export default {
  async fetch(request, env, ctx) {
    return handler({ request, context: { cloudflare: { env, ctx } } });
  }
};
`.trim();
    writeFileSync(workerOutput, workerCode, "utf-8");
  }
}

// Cleanup
import { unlinkSync } from "fs";
try { unlinkSync(workerEntry); } catch {}

if (existsSync(workerOutput)) {
  const size = (existsSync(workerOutput) ? readFileSync(workerOutput).length : 0);
  console.log(`✅ Created build/client/_worker.js (${Math.round(size / 1024)}KB)`);
  console.log("\n🚀 Ready! Run:");
  console.log("   npx wrangler pages deploy build/client --project-name unicorn-smart-ai\n");
} else {
  console.error("❌ Failed to create _worker.js");
  process.exit(1);
}
