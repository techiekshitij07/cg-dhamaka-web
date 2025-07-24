import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
};

export const generateResponse = async (message: string): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini API not initialized. Please provide your API key.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
    You are a helpful AI assistant for a Chhattisgarh cultural website. You should respond in Chhattisgarhi language as much as possible. 
    You have knowledge about:
    - Chhattisgarh weather, culture, traditions
    - Local festivals like Hareli, Pola, Devari
    - Folk dances like Panthi, Raut Nacha, Karma
    - Handicrafts, tribal culture
    - Chhattisgarhi language and poetry
    - Local news and events
    
    User's question: ${message}
    
    Please respond in a friendly, helpful manner in Chhattisgarhi language. If you don't know something specific about Chhattisgarh, politely say so and provide general helpful information.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};

export const isGeminiInitialized = () => {
  return genAI !== null;
};