const { createClient } = require('@supabase/supabase-js');

// เชื่อมต่อตรงด้วย Service Role Key สิทธิ์สูงสุด
const supabase = createClient(
  'https://mewjhcheciafyuxkngqn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ld2poY2hlY2lhZnl1eGtuZ3FuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE5MzAwNSwiZXhwIjoyMDg3NzY5MDA1fQ.mxs0LTJm3XDMLWQizzXd_LgelUhLIORZtr59GoKE-x4'
);

async function updatePassword() {
  console.log(`🦄 --- RESETTING PASSWORD FOR EXISTING USER ---`);
  
  try {
    // 1. ดึงข้อมูลรายการผู้ใช้จากระบบ Auth ทั้งหมดเพื่อค้นหา uniai-test
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) throw listError;
    
    const targetUser = users.find(u => u.email === 'densmartai@gmail.com' || u.email?.includes('uniai-test'));
    
    if (!targetUser) {
      console.log('❌ ไม่พบผู้ใช้ uniai-test ในระบบ auth.users');
      return;
    }
    
    console.log(`พบผู้ใช้: ID = ${targetUser.id}, Email = ${targetUser.email}`);
    
    // 2. ปรับปรุงรหัสผ่านของ Target User ให้เป็นรหัสผ่านที่เราทราบแบบด่วน
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      targetUser.id,
      { password: 'Tester123456!' }
    );
    
    if (updateError) throw updateError;
    
    console.log(`✅ [สำเร็จ!] รหัสผ่านของผู้ใช้ ${targetUser.email} ได้รับการตั้งใหม่เป็น: Tester123456!`);
  } catch (err) {
    console.error(`❌ ขัดข้องในการรีเซ็ตรหัสผ่าน:`, err.message);
  }
}

updatePassword();
