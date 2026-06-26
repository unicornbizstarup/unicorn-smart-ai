#!/usr/bin/env node
/**
 * build-deploy.js
 * Prepares the React Router v7 SSR build for Cloudflare Pages deployment.
 *
 * Strategy: Copy build/server/index.js into build/client/
 * so the functions/[[path]].ts can resolve it at `./index.js`
 * and Wrangler bundles everything together correctly.
 */

import { existsSync, mkdirSync, copyFileSync, writeFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const serverBundle = join(__dirname, 'build', 'server', 'index.js');
const serverDest = join(__dirname, 'build', 'client', 'server-bundle.js');
const workerDest = join(__dirname, 'build', 'client', '_worker.js');

console.log('📦 Preparing Cloudflare Pages deploy bundle...\n');

// 1. Verify server bundle exists
if (!existsSync(serverBundle)) {
  console.error('❌ build/server/index.js not found. Run `npm run build` first.');
  process.exit(1);
}

// 2. Copy server bundle into build/client as server-bundle.js
copyFileSync(serverBundle, serverDest);
console.log('✅ Copied build/server/index.js → build/client/server-bundle.js');

// 3. Create _worker.js inside build/client (Cloudflare Pages SPA worker approach)
//    This is the single-file worker that handles all SSR requests.
const workerContent = `
import { createPagesFunctionHandler } from "@react-router/cloudflare";
import * as build from "./server-bundle.js";

const handler = createPagesFunctionHandler({ build });

export default {
  async fetch(request, env, ctx) {
    return handler({ request, env, ctx });
  }
};
`.trim();

writeFileSync(workerDest, workerContent, 'utf-8');
console.log('✅ Created build/client/_worker.js');

console.log('\n🚀 Ready to deploy! Run:');
console.log('   npx wrangler pages deploy build/client --project-name unicorn-smart-ai\n');
