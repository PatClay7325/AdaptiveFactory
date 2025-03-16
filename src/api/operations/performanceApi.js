import { supabase } from '../supabase';

export const getPerformanceMetrics = async (timeRange = 'week') => {
  const { data, error } = await supabase
    .from('performance_metrics')
    .select('*')
    .eq('time_range', timeRange);
  
  if (error) throw error;
  return data;
};

export const getHistoricalData = async (entityType, entityId, timeRange) => {
  const { data, error } = await supabase
    .from('operation_history')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('timestamp', { ascending: false })
    .limit(timeRange === 'all' ? 1000 : 100);
  
  if (error) throw error;
  return data;
};