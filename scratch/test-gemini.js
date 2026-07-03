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

const geminiApiKey = envVars.GEMINI_API_KEY;
console.log("Using GEMINI_API_KEY:", geminiApiKey ? geminiApiKey.slice(0, 10) + "..." : "undefined");

async function testEmbedding(version) {
  const url = `https://generativelanguage.googleapis.com/${version}/models/text-embedding-004:embedContent?key=${geminiApiKey}`;
  console.log(`Testing ${version} embedding API...`);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/text-embedding-004",
        content: { parts: [{ text: "Hello World" }] },
      }),
    });

    console.log(`Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

async function testFlash(version) {
  const url = `https://generativelanguage.googleapis.com/${version}/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
  console.log(`Testing ${version} gemini-2.5-flash generateContent API...`);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Say hello" }] }]
      }),
    });

    console.log(`Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

async function run() {
  await testEmbedding("v1");
  console.log("------------------------");
  await testEmbedding("v1beta");
  console.log("------------------------");
  await testFlash("v1beta");
}

run().catch(console.error);
