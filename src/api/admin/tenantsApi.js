import { supabase } from '../supabase';

export const getTenants = async () => {
  const { data, error } = await supabase
    .from('tenants')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const getTenantById = async (id) => {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createTenant = async (tenantData) => {
  const { data, error } = await supabase
    .from('tenants')
    .insert([tenantData]);
  
  if (error) throw error;
  return data;
};

export const updateTenant = async (id, tenantData) => {
  const { data, error } = await supabase
    .from('tenants')
    .update(tenantData)
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

export const deleteTenant = async (id) => {
  const { error } = await supabase
    .from('tenants')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};