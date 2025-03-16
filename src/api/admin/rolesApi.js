import { supabase } from '../supabase';

export const getRoles = async () => {
  const { data, error } = await supabase
    .from('roles')
    .select('*, permissions(*)');
  
  if (error) throw error;
  return data;
};

export const getRoleById = async (id) => {
  const { data, error } = await supabase
    .from('roles')
    .select('*, permissions(*)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createRole = async (roleData) => {
  const { data, error } = await supabase
    .from('roles')
    .insert([roleData]);
  
  if (error) throw error;
  return data;
};

export const updateRole = async (id, roleData) => {
  const { data, error } = await supabase
    .from('roles')
    .update(roleData)
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

export const deleteRole = async (id) => {
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};