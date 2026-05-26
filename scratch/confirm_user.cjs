const { createClient } = require('@supabase/supabase-js');

// เชื่อมต่อตรงด้วย Service Role Key สิทธิ์สูงสุด
const supabase = createClient(
  'https://mewjhcheciafyuxkngqn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ld2poY2hlY2lhZnl1eGtuZ3FuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE5MzAwNSwiZXhwIjoyMDg3NzY5MDA1fQ.mxs0LTJm3XDMLWQizzXd_LgelUhLIORZtr59GoKE-x4'
);

async function forceConfirmEmail() {
  console.log(`🦄 --- FORCE CONFIRMING EMAIL FOR TEST USER ---`);
  
  try {
    // 1. ค้นหาผู้ใช้จาก Email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;
    
    const targetUser = users.find(u => u.email === 'densmartai@gmail.com');
    if (!targetUser) {
      console.log('❌ ไม่พบผู้ใช้ densmartai@gmail.com');
      return;
    }
    
    console.log(`พบผู้ใช้: ID = ${targetUser.id}, สถานะ Confirm เดิม = ${targetUser.email_confirmed_at ? 'ยืนยันแล้ว' : 'ยังไม่ได้ยืนยัน'}`);
    
    // 2. สั่งแอดมินบังคับยืนยันอีเมลทันที (Set email_confirm: true และเซ็ต confirmed_at)
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      targetUser.id,
      { 
        email_confirm: true, // บังคับให้ยืนยันผ่าน API
        email_confirmed_at: new Date().toISOString() // หรือบังคับเซ็ตเวลาที่ยืนยัน
      }
    );
    
    if (updateError) throw updateError;
    
    console.log(`✅ [สำเร็จยอดเยี่ยม!] บัญชี ${targetUser.email} ได้รับการปลดล็อกสถานะและบังคับยืนยันอีเมลสำเร็จเรียบร้อย!`);
  } catch (err) {
    console.error(`❌ ขัดข้องในการบังคับยืนยันอีเมล:`, err.message);
  }
}

forceConfirmEmail();
