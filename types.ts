
export interface HealthMetrics {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  pedigree: number;
  age: number;
}

export interface RiskResult {
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Critical';
  summary: string;
  recommendations: string[];
}

export interface SavedAssessment {
  id: string;
  created_at: string;
  metrics: HealthMetrics;
  risk_result: RiskResult;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type AppTab = 'home' | 'assessment' | 'insights' | 'history' | 'chat';
