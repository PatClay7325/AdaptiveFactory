import { supabase } from '../supabase';

export const getProductionPlans = async (filter = {}) => {
  let query = supabase
    .from('production_plans')
    .select('*, created_by(*)');
  
  if (filter.status) query = query.eq('status', filter.status);
  if (filter.date_range) {
    query = query
      .gte('start_date', filter.date_range[0])
      .lte('end_date', filter.date_range[1]);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

export const getPlanById = async (id) => {
  const { data, error } = await supabase
    .from('production_plans')
    .select('*, plan_items(*), created_by(*)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createPlan = async (planData) => {
  const { data, error } = await supabase
    .from('production_plans')
    .insert([planData]);
  
  if (error) throw error;
  return data;
};

export const updatePlan = async (id, planData) => {
  const { data, error } = await supabase
    .from('production_plans')
    .update(planData)
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

export const deletePlan = async (id) => {
  const { error } = await supabase
    .from('production_plans')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};