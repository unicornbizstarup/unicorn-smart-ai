@echo off
chcp 65001 > nul
echo ========================================================
echo 🦄 Unicorn Academy - 8-Stack Auto Setup Script
echo ========================================================
echo.

echo [1/3] กำลังคัดลอกไฟล์ไปยังโครงสร้าง Next.js 8-Stack...
echo.

mkdir src\types 2>nul
copy index.ts src\types\index.ts /Y

mkdir src\app\(admin)\admin\products 2>nul
copy ProductForm.tsx src\app\(admin)\admin\products\ProductForm.tsx /Y
copy actions.ts src\app\(admin)\admin\products\actions.ts /Y
copy page.tsx src\app\(admin)\admin\products\page.tsx /Y

copy layout.tsx src\app\(admin)\admin\layout.tsx /Y
copy globals.css src\app\globals.css /Y

mkdir src\lib 2>nul
copy rag.ts src\lib\rag.ts /Y

mkdir workers 2>nul
copy proxy.ts workers\proxy.ts /Y

mkdir supabase 2>nul
copy schema.sql supabase\schema.sql /Y

echo.
echo [2/3] กำลังติดตั้ง Dependencies (npm install)...
echo.
call npm install

echo.
echo [3/3] การ Deploy Cloudflare Workers:
echo กรุณารันคำสั่งสองบรรทัดนี้ในภายหลัง:
echo 1. wrangler secret put GEMINI_API_KEY
echo 2. npm run workers:deploy
echo.
echo ========================================================
echo จัดการไฟล์และติดตั้ง Packages เสร็จเรียบร้อยแล้วครับ!
echo กดปุ่มใดๆ เพื่อเริ่มต้น npm run dev เพื่อรัน Local Server...
echo ========================================================
pause
call npm run dev
