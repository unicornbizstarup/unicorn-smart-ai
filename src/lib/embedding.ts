import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client using the environment variable.
// Supports both standard GEMINI_API_KEY and GERMINI_API_KEY.
const getApiKey = () => {
  return process.env.GEMINI_API_KEY || process.env.GERMINI_API_KEY || '';
};

export async function embedText(text: string): Promise<number[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY or GERMINI_API_KEY is missing from environment variables');
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Gemini text-embedding-004 returns a 768-dimensional vector
  const response = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: text.slice(0, 8192), // Keep within model token limits
  });

  if (!response.embedding?.values) {
    throw new Error('No embedding values returned from Gemini API');
  }

  return response.embedding.values;
}
