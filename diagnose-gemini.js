import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function diagnoseGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('--- 🛡️ Unicorn Smart AI: Gemini Diagnostic 2026 ---');
    console.log('Time:', new Date().toLocaleString());

    if (!apiKey) {
        console.error('❌ Error: GEMINI_API_KEY not found in .env');
        return;
    }

    console.log(`Using API Key starting with: ${apiKey.substring(0, 6)}...`);

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log('\n1. Testing API Connectivity (listModels)...');
        // The listModels method returns an AsyncGenerator in newer versions of the SDK
        // but for compatibility with common versions, let's try to fetch models.
        try {
            // Note: In some versions of @google/generative-ai, listModels is on genAI.
            // If it fails, we fall back to a direct test.
            if (genAI.listModels) {
                const result = await genAI.listModels();
                console.log('✅ Connection to Google API: SUCCESS');
                console.log('Available Models:');
                for (const model of result.models) {
                    console.log(`   - ${model.name} (${model.supportedGenerationMethods.join(', ')})`);
                }
            } else {
                console.log('ℹ️ SDK version does not support listModels() directly on genAI instance.');
            }
        } catch (e) {
            console.log('❌ Connection to Google API: FAILED');
            console.log(`   Error: ${e.message}`);

            if (e.message.includes('API_KEY_INVALID') || e.message.includes('expired')) {
                console.log('\n🚨 แนะนำ: API Key นี้แจ้งว่า "Expired" หรือ "Invalid"');
                console.log('กรุณาตรวจสอบว่า:');
                console.log('1. คุณพี่ได้กดยืนยันการสร้าง Key ใน Google AI Studio หรือยัง?');
                console.log('2. โปรเจกต์ใน Google Cloud ยังคงทำงานอยู่ (ไม่ถูกระงับ)?');
                console.log('3. รอประมาณ 5-15 นาทีเพื่อให้ Key เริ่มทำงานในระบบของ Google ค่ะ');
            }
        }

        console.log('\n2. Testing Specific Model (gemini-2.0-flash-lite)...');
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
            const result = await model.generateContent('ping');
            console.log('✅ Model "gemini-2.0-flash-lite": ACCESSIBLE');
            console.log(`   Response: ${result.response.text()}`);
        } catch (e) {
            console.log('❌ Model "gemini-2.0-flash-lite": NOT ACCESSIBLE');
            console.log(`   Error: ${e.message.split('\n')[0]}`);
        }

    } catch (error) {
        console.error('Critical Diagnostic Error:', error.message);
    }
}

diagnoseGemini();
