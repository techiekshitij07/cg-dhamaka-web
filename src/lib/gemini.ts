import { GoogleGenerativeAI } from '@google/generative-ai';

// Auto-initialize with API key
const API_KEY = "AIzaSyAFoMbKNhJCNlkg6YuPQfEVLFgfbxwguh0";
let genAI: GoogleGenerativeAI = new GoogleGenerativeAI(API_KEY);

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
};

export const generateResponse = async (message: string): Promise<string> => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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
  return true; // Always initialized with API key
};