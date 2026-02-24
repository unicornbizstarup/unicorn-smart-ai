import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Chat Proxy Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, focusArea, systemInstruction } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('SERVER ERROR: GEMINI_API_KEY is missing from .env');
      return res.status(500).json({ error: 'API Key not found on server. Please check your .env file on VPS.' });
    }

    // Initialize Gemini inside the handler to ensure fresh environment variables
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      systemInstruction: systemInstruction
    });

    // Transform messages for Gemini
    // CRITICAL: Gemini history MUST start with a 'user' message
    const firstUserIndex = messages.findIndex(m => m.role === 'user');
    const history = firstUserIndex !== -1
      ? messages.slice(firstUserIndex, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }))
      : [];

    const chat = model.startChat({
      history: history
    });

    const lastMessage = messages[messages.length - 1].text;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error('--- GEMINI PROXY ERROR ---');
    console.error('Time:', new Date().toISOString());
    console.error('Message:', error.message);
    if (error.stack) console.error('Stack:', error.stack);

    res.status(500).json({
      error: 'Failed to communicate with AI Coach',
      details: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Uni Smart AI Backend is running' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
