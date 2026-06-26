#!/usr/bin/env node
/**
 * build-deploy.js
 * Prepares the React Router v7 SPA + Functions build for Cloudflare Pages deployment.
 */

import { existsSync, mkdirSync, copyFileSync, writeFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const serverBundle = join(__dirname, 'build', 'server', 'worker.js');
const serverDest = join(__dirname, 'build', 'client', 'server-bundle.js');
const workerDest = join(__dirname, 'build', 'client', '_worker.js');
const clientFunctionsDir = join(__dirname, 'build', 'client', 'functions');

console.log('📦 Preparing Cloudflare Pages Functions deploy bundle...\n');

// 1. Verify server bundle exists
if (!existsSync(serverBundle)) {
  console.error('❌ build/server/worker.js not found. Run `npm run build` first.');
  process.exit(1);
}

// 2. Copy server bundle into build/client as server-bundle.js
copyFileSync(serverBundle, serverDest);
console.log('✅ Copied build/server/worker.js → build/client/server-bundle.js');

// 3. Clean up _worker.js if exists (to enable Cloudflare Pages Functions mode)
if (existsSync(workerDest)) {
  rmSync(workerDest);
  console.log('🧹 Cleaned up build/client/_worker.js to enable Pages Functions mode');
}

// 4. Create build/client/functions directory
if (!existsSync(clientFunctionsDir)) {
  mkdirSync(clientFunctionsDir, { recursive: true });
}

// 5. Generate build/client/functions/[[path]].ts
const functionsContent = `
/**
 * build/client/functions/[[path]].ts — Cloudflare Pages Functions SSR handler
 * Generated automatically at build time.
 */
import { createRequestHandler } from "@react-router/cloudflare";
// @ts-ignore — resolved from build/client/server-bundle.js
import * as build from "../server-bundle.js";

const handler = createRequestHandler({
  build,
  getLoadContext() {
    return undefined as any;
  },
});

export const onRequest: PagesFunction = async (context) => {
  const method = context.request.method;

  // Try to serve static assets first (Only for GET and HEAD requests)
  if (method === "GET" || method === "HEAD") {
    try {
      const assetResponse = await context.env.ASSETS.fetch(context.request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    } catch {}
  }

  // Set global CF_ENV for Supabase Server Client
  // @ts-ignore
  globalThis.CF_ENV = context.env;

  // Fall through to React Router SSR / API Action
  return handler(context);
};
`.trim();

writeFileSync(join(clientFunctionsDir, '[[path]].ts'), functionsContent, 'utf-8');
console.log('✅ Generated build/client/functions/[[path]].ts');
console.log('\n🚀 Ready to deploy with Pages Functions! Run:');
console.log('   npx wrangler pages deploy build/client --project-name unicorn-smart-ai\n');

console.log('\n🚀 Ready to deploy! Run:');
console.log('   npx wrangler pages deploy build/client --project-name unicorn-smart-ai\n');
