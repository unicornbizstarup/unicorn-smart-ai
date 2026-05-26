const https = require('https');

const options = {
  hostname: 'mewjhcheciafyuxkngqn.supabase.co',
  path: '/rest/v1/',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ld2poY2hlY2lhZnl1eGtuZ3FuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE5MzAwNSwiZXhwIjoyMDg3NzY5MDA1fQ.mxs0LTJm3XDMLWQizzXd_LgelUhLIORZtr59GoKE-x4',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ld2poY2hlY2lhZnl1eGtuZ3FuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE5MzAwNSwiZXhwIjoyMDg3NzY5MDA1fQ.mxs0LTJm3XDMLWQizzXd_LgelUhLIORZtr59GoKE-x4'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const spec = JSON.parse(data);
      const profiles = spec.definitions.profiles;
      
      console.log('🦄 --- PROFILES DEFINITION DIRECT FROM LIVE SUPABASE ---');
      console.log('1. Required Fields (ฟิลด์ห้ามว่าง):', profiles.required || 'ไม่มีฟิลด์บังคับ');
      
      console.log('\n2. Columns & Types (คอลัมน์และประเภทข้อมูลที่มีทั้งหมด):');
      for (const [key, val] of Object.entries(profiles.properties)) {
        const isRequired = profiles.required && profiles.required.includes(key);
        console.log(`- ${key}: ${val.type} ${isRequired ? '[REQUIRED ⚠️]' : ''}`);
      }
    } catch (err) {
      console.error('Error parsing response:', err.message);
    }
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
