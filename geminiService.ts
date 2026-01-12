import { GoogleGenAI, Type } from "@google/genai";
import { HealthMetrics, RiskResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getAIAssessment = async (metrics: HealthMetrics): Promise<RiskResult> => {
  if (!ai) throw new Error("API Key missing");

  const prompt = `Analyze these diabetes risk metrics based on the PIMA dataset context:
    Age: ${metrics.age}
    BMI: ${metrics.bmi}
    Glucose: ${metrics.glucose}
    Blood Pressure: ${metrics.bloodPressure}
    Insulin: ${metrics.insulin}
    Pregnancies: ${metrics.pregnancies}
    Pedigree Function: ${metrics.pedigree}
    
    Provide a detailed health risk assessment including a score (0-100), risk level (Low, Moderate, High, Critical), 
    a summary of the findings, and 3 specific actionable recommendations.`;

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

  return JSON.parse(response.text || '{}') as RiskResult;
};

export const chatWithCapsule = async (message: string, history: any[]) => {
  if (!ai) throw new Error("API Key missing");

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are "Capsule", an AI assistant for the Diabetes Health Care Programme (DHCP). Your goal is to provide helpful, evidence-based, and empathetic information about diabetes prevention, management, and UN SDG 3 goals. Always advise consulting a medical professional for clinical diagnosis.',
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};