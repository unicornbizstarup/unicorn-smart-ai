import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function diagnoseGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ Error: GEMINI_API_KEY not found in .env');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    console.log('--- 🛡️ Unicorn Smart AI: Gemini Diagnostic 2026 ---');
    console.log('Time:', new Date().toLocaleString());

    try {
        console.log('Attempting to list all available models for this API Key...');

        // Use the generative AI client to list models
        // Note: The SDK might not have a direct listModels on genAI, 
        // usually we need to fetch from the API directly or use the model service.
        // However, for debugging, let's try a direct fetch to the discovery endpoint if needed.
        // For now, let's try a very common model that should always exist if the key is valid.

        const testModel = 'gemini-1.5-flash';
        try {
            const model = genAI.getGenerativeModel({ model: testModel });
            const result = await model.generateContent('ping');
            console.log(`✅ Basic Connectivity Test (${testModel}): SUCCESS`);
        } catch (e) {
            console.log(`❌ Basic Connectivity Test (${testModel}): FAILED`);
            console.log(`   Error Reason: ${e.message}`);
            if (e.message.includes('API_KEY_INVALID') || e.message.includes('403') || e.message.includes('expired')) {
                console.log('\n🚨 POSSIBLE CAUSE: Your API Key is likely EXPIRED or INVALID.');
            }
        }

        const candidates = [
            'gemini-2.0-flash-lite',
            'gemini-2.0-flash',
            'gemini-1.5-flash',
            'gemini-1.5-pro'
        ];

        console.log('\nChecking specific model availability:');
        for (const modelName of candidates) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                await model.generateContent('Hi');
                console.log(`✅ Model "${modelName}": AVAILABLE`);
            } catch (e) {
                console.log(`❌ Model "${modelName}": NOT AVAILABLE`);
            }
        }

    } catch (error) {
        console.error('Diagnostic process encountered a critical error:', error.message);
    }
}

diagnoseGemini();
