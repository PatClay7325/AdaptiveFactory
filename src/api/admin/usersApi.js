import { supabase } from '../supabase';

export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*, roles(*)');
  
  if (error) throw error;
  return data;
};

export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('*, roles(*)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData]);
  
  if (error) throw error;
  return data;
};

export const updateUser = async (id, userData) => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

export const deleteUser = async (id) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};