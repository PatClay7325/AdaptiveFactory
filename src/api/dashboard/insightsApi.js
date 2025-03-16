import { supabase } from '../supabase';

export const getAIInsights = async (limit = 5) => {
  const { data, error } = await supabase
    .from('ai_insights')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

export const saveInsight = async (insightData) => {
  const { data, error } = await supabase
    .from('ai_insights')
    .insert([insightData]);
  
  if (error) throw error;
  return data;
};