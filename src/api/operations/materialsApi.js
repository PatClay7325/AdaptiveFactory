import { supabase } from '../supabase';

export const getMaterials = async (filters = {}) => {
  let query = supabase
    .from('materials')
    .select('*');
  
  if (filters.category) query = query.eq('category', filters.category);
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

export const getMaterialRequirements = async (jobId) => {
  const { data, error } = await supabase
    .from('material_requirements')
    .select('*, material(*)')
    .eq('job_id', jobId);
  
  if (error) throw error;
  return data;
};

export const updateMaterialInventory = async (materialId, quantity) => {
  // First get current material
  const { data: currentMaterial, error: fetchError } = await supabase
    .from('materials')
    .select('quantity')
    .eq('id', materialId)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Then update with new quantity
  const { data, error } = await supabase
    .from('materials')
    .update({ quantity: currentMaterial.quantity + quantity })
    .eq('id', materialId);
  
  if (error) throw error;
  return data;
};