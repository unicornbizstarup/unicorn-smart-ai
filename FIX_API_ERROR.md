# วิธีแก้ไข Error: Unexpected token '<' (Fixing API Proxy) 🛡️🚀

สาเหตุของ Error นี้คือ **Frontend (Vite)** พยายามเรียกไปที่ `/api/chat` แต่ **Nginx** บน VPS หาไฟล์ไม่เจอ (404) จึงส่งหน้า HTML กลับมาแทน JSON ครับ

กรุณาทำตามขั้นตอนดังนี้เพื่อเปิดใช้งานระบบ Backend:

## 1. แก้ไข Nginx Config บน VPS

เข้าใช้งาน Terminal ของ VPS และแก้ไขไฟล์ Config ของ Nginx (เช่น `/etc/nginx/sites-available/default` หรือไฟล์ที่คุณสร้างไว้):

```nginx
server {
    listen 80;
    server_name unicornsmartai.cloud; # หรือ IP ของคุณ

    root /var/www/unicorn-smart-ai;
    index index.html;

    # สำหรับ Frontend (React/Vite)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # เพิ่มส่วนนี้สำหรับ Backend Proxy ✨
    location /api/ {
        proxy_pass http://localhost:3000; # ส่งคำขอไปที่ Node.js server
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

หลังจากแก้ไขแล้วให้รัน: `sudo nginx -t` และ `sudo systemctl restart nginx`

## 2. เริ่มทำงาน Node.js Backend

ตรวจสอบว่าไฟล์ `server.js` และ `package.json` อยู่ที่ `/var/www/unicorn-smart-ai` แล้ว:

```bash
cd /var/www/unicorn-smart-ai
npm install
# เริ่มทำงานด้วย PM2 เพื่อให้ระบบรันตลอดเวลา
pm2 start server.js --name "unicorn-backend"
```

## 3. ตรวจสอบ .env

อย่าลืมสร้างไฟล์ `.env` ไว้ในโฟลเดอร์เดียวกันบน VPS:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
```

เมื่อทำครบถ้วนแล้ว ระบบ AI Coach จะสามารถสื่อสารได้ทันทีครับ! 🦄✨
