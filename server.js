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

    if (!process.env.GEMINI_API_KEY) {
      console.error('SERVER ERROR: GEMINI_API_KEY not found in .env');
      return res.status(500).json({ error: 'Gemini API Key is not configured on server' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction
    });

    // Transform messages for Gemini
    // We skip the first assistant message if it's the welcome message because Gemini needs 'user' to start or a specific order
    const history = messages
      .filter((m, idx) => !(idx === 0 && m.role === 'assistant'))
      .slice(0, -1)
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

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
    console.error('Error Details:', error);
    res.status(500).json({ error: 'Failed to communicate with AI Coach', details: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Uni Smart AI Backend is running' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
