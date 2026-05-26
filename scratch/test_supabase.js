const { createClient } = require('@supabase/supabase-js');

// เชื่อมต่อตรงด้วย Service Role Key สิทธิ์สูงสุด
const supabase = createClient(
  'https://mewjhcheciafyuxkngqn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ld2poY2hlY2lhZnl1eGtuZ3FuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE5MzAwNSwiZXhwIjoyMDg3NzY5MDA1fQ.mxs0LTJm3XDMLWQizzXd_LgelUhLIORZtr59GoKE-x4'
);

async function runDiagnostics() {
  const uniqueId = Date.now();
  const testEmail = `tester_${uniqueId}@unicorn.systems`;
  const testUsername = `tester_${uniqueId}`;
  
  console.log(`🦄 --- SUPABASE SIGNUP DIAGNOSTICS ---`);
  console.log(`[1] กำลังทดลองลงทะเบียนผู้ใช้ใหม่เอี่ยมเพื่อตัดปัญหาข้อมูลค้าง:`);
  console.log(`- Email: ${testEmail}`);
  console.log(`- Username: ${testUsername}`);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'Tester123456!',
      options: {
        data: {
          full_name: 'ผู้ทดสอบระบบด่วน',
          username: testUsername,
          phone: '0800000000'
        }
      }
    });

    if (error) {
      console.error(`❌ [ล้มเหลว] ตรวจพบข้อผิดพลาดของ Supabase Auth:`, error.message);
      console.error(JSON.stringify(error, null, 2));
    } else {
      console.log(`✅ [สำเร็จ] ลงทะเบียนเรียบร้อย! ข้อมูลที่ได้:`, data.user?.id);
    }
  } catch (err) {
    console.error(`💥 [ขัดข้องร้ายแรง]:`, err);
  }
}

runDiagnostics();
