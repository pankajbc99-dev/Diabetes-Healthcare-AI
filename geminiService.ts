import { GoogleGenAI, Type } from "@google/genai";
import { HealthMetrics, RiskResult } from "../types";

// These variables are injected by vite.config.ts at build time
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getAIAssessment = async (metrics: HealthMetrics): Promise<RiskResult> => {
  if (!ai) {
    throw new Error("Gemini API Key is missing. Ensure API_KEY is set in your Vercel/Render Environment Variables.");
  }

  const prompt = `Analyze these diabetes risk metrics and provide a JSON response:
    Age: ${metrics.age}
    BMI: ${metrics.bmi}
    Glucose: ${metrics.glucose}
    Blood Pressure: ${metrics.bloodPressure}
    Insulin: ${metrics.insulin}
    Pregnancies: ${metrics.pregnancies}
    Pedigree Function: ${metrics.pedigree}
    
    Response must include: score (0-100), level (Low, Moderate, High, Critical), summary, and 3 recommendations.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          level: { type: Type.STRING },
          summary: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["score", "level", "summary", "recommendations"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(text) as RiskResult;
};

export const chatWithCapsule = async (message: string, history: any[]) => {
  if (!ai) throw new Error("Gemini API Key is missing.");

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are "Capsule", an AI health assistant for the Diabetes Health Care Programme (DHCP). Be empathetic and evidence-based. Aligned with UN SDG 3.',
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
