import { GoogleGenAI } from "@google/genai";
import { Message, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateChatResponse(messages: Message[], language: Language = 'fr') {
  try {
    const history = messages.slice(0, -1).map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const lastMessage = messages[messages.length - 1].text;

    const systemInstruction = `You are SlimAI, a stylish and helpful AI assistant. 
    Your personality is professional yet friendly, inspired by modern minimalist design.
    You must respond in ${language === 'fr' ? 'French' : 'English'}.
    Use markdown for formatting. Keep responses concise and helpful.
    You are part of a modern interface designed with soft pastel colors (green, blue, pink).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...history, { role: 'user', parts: [{ text: lastMessage }] }],
      config: {
        systemInstruction,
      }
    });

    return response.text || (language === 'fr' ? "Désolé, je n'ai pas pu générer de réponse." : "I'm sorry, I couldn't generate a response.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return language === 'fr' 
      ? "Une erreur s'est produite lors de la communication avec SlimAI. Veuillez vérifier votre connexion ou votre clé API."
      : "An error occurred while communicating with SlimAI. Please check your connection or API key.";
  }
}

