import { createClient } from '@supabase/supabase-js';
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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration. URL:", supabaseUrl, "Key length:", supabaseKey?.length);
  process.exit(1);
}

console.log("Connecting to:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('knowledge_docs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Query failed:", error);
    process.exit(1);
  }

  console.log("Recent Knowledge Docs:");
  console.log(JSON.stringify(data, null, 2));

  // Let's also check knowledge_chunks count for these docs
  for (const doc of data) {
    const { count, error: countErr } = await supabase
      .from('knowledge_chunks')
      .select('*', { count: 'exact', head: true })
      .eq('doc_id', doc.id);
    console.log(`Doc ID: ${doc.id} | Title: "${doc.title}" | Status: ${doc.status} | Error: "${doc.error_msg}" | Chunks in DB: ${countErr ? 'Error: ' + countErr.message : count}`);
  }
}

main().catch(console.error);
