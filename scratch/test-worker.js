import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse .env.local manually
const envPath = path.join(__dirname, '../unicorn-academy-8stack/.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx > 0) {
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    envVars[key] = val;
  }
});

const workersUrl = envVars.WORKERS_URL;
console.log("Testing Cloudflare Worker URL:", workersUrl);

async function testWorker() {
  try {
    const res = await fetch(workersUrl);
    console.log(`Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log("Worker Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Worker connection failed:", err.message);
  }
}

testWorker().catch(console.error);
