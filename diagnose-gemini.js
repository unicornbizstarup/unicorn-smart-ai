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

    console.log('--- 🛡️ Unicorn Smart AI: Gemini Diagnostic ---');
    console.log('Time:', new Date().toLocaleString());

    try {
        // Test with v1 explicitly if v1beta fails in the SDK
        console.log('Checking available models...');

        // Note: The SDK might not expose listModels directly in some versions
        // So we try a simpler way: Test a few likely candidates
        const candidates = [
            'gemini-2.0-flash',
            'gemini-2.0-flash-lite',
            'gemini-1.5-flash',
            'gemini-pro'
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
