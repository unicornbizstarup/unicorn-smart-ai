import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ Error: GEMINI_API_KEY not found in .env');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    console.log('--- 🛡️ Unicorn Smart AI: Gemini Diagnostic 2026 ---');
    console.log('Time:', new Date().toLocaleString());

    try {
        console.log('Checking available models...');

        const candidates = [
            'gemini-3-flash',
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-1.5-flash'
        ];

        for (const modelName of candidates) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hi');
                console.log(`✅ Model "${modelName}" is AVAILABLE`);
            } catch (e) {
                console.log(`❌ Model "${modelName}" is NOT AVAILABLE (Error: ${e.message.split('\n')[0]})`);
            }
        }

    } catch (error) {
        console.error('Diagnostic failed:', error.message);
    }
}

listModels();
