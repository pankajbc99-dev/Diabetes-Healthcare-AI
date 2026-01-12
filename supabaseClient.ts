import { createClient } from '@supabase/supabase-js';
import { HealthMetrics, RiskResult, SavedAssessment } from '../types';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Only initialize if we have valid credentials to prevent runtime errors
export const supabase = (supabaseUrl.startsWith('http') && supabaseAnonKey.length > 0) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const saveAssessment = async (metrics: HealthMetrics, result: RiskResult) => {
  if (!supabase) return null;
  
  try {
    const { data, error } = await supabase
      .from('assessments')
      .insert([
        { 
          metrics, 
          risk_result: result 
        }
      ])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error saving to Supabase:', error);
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
    console.error('Error fetching from Supabase:', error);
    return [];
  }
};