import { createClient } from '@supabase/supabase-js';
import { HealthMetrics, RiskResult, SavedAssessment } from '../types';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Only initialize if variables are present and valid
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const saveAssessment = async (metrics: HealthMetrics, result: RiskResult) => {
  if (!supabase) return null;
  
  try {
    const { data, error } = await supabase
      .from('assessments')
      .insert([{ metrics, risk_result: result }])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Supabase Save Error:', error);
    return null;
  }
};

export const fetchHistory = async (): Promise<SavedAssessment[]> => {
  if (!supabase) return [];
  
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as SavedAssessment[]) || [];
  } catch (error) {
    console.error('Supabase Fetch Error:', error);
    return [];
  }
};
