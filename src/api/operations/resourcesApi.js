import { supabase } from '../supabase';

export const getResources = async (type = null) => {
  let query = supabase
    .from('resources')
    .select('*');
  
  if (type) query = query.eq('type', type);
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

export const getResourceAllocation = async (date) => {
  const { data, error } = await supabase
    .from('resource_allocation')
    .select('*, resource(*), job(*)')
    .eq('date', date);
  
  if (error) throw error;
  return data;
};

export const allocateResource = async (allocationData) => {
  const { data, error } = await supabase
    .from('resource_allocation')
    .insert([allocationData]);
  
  if (error) throw error;
  return data;
};

export const updateResourceAllocation = async (id, allocationData) => {
  const { data, error } = await supabase
    .from('resource_allocation')
    .update(allocationData)
    .eq('id', id);
  
  if (error) throw error;
  return data;
};