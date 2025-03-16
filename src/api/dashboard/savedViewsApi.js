import { supabase } from '../supabase';

export const getSavedViews = async () => {
  const { data, error } = await supabase
    .from('saved_views')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const createSavedView = async (viewData) => {
  const { data, error } = await supabase
    .from('saved_views')
    .insert([viewData]);
  
  if (error) throw error;
  return data;
};

export const deleteSavedView = async (id) => {
  const { error } = await supabase
    .from('saved_views')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};