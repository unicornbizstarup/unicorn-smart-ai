const fs = require('fs');

try {
  const spec = JSON.parse(fs.readFileSync('scratch/openapi.json', 'utf8'));
  const profiles = spec.definitions.profiles;
  
  console.log('🦄 --- PROFILES DEFINITION FROM LIVE SUPABASE ---');
  console.log('1. Required Fields (ฟิลด์ห้ามว่าง):', profiles.required || 'ไม่มีฟิลด์บังคับ');
  
  console.log('\n2. Columns & Types (คอลัมน์และประเภทข้อมูลที่มีทั้งหมด):');
  for (const [key, val] of Object.entries(profiles.properties)) {
    const isRequired = profiles.required && profiles.required.includes(key);
    console.log(`- ${key}: ${val.type} ${isRequired ? '[REQUIRED ⚠️]' : ''} (${val.description || ''})`);
  }
} catch (err) {
  console.error('Error parsing openapi.json:', err);
}
