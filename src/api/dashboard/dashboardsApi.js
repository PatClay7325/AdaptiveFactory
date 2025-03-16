import { supabase } from '../supabase';

export const getCustomDashboards = async () => {
  const { data, error } = await supabase
    .from('custom_dashboards')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const getDashboardById = async (id) => {
  const { data, error } = await supabase
    .from('custom_dashboards')
    .select('*, dashboard_widgets(*)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createDashboard = async (dashboardData) => {
  const { data, error } = await supabase
    .from('custom_dashboards')
    .insert([dashboardData]);
  
  if (error) throw error;
  return data;
};

export const updateDashboard = async (id, dashboardData) => {
  const { data, error } = await supabase
    .from('custom_dashboards')
    .update(dashboardData)
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

export const deleteDashboard = async (id) => {
  const { error } = await supabase
    .from('custom_dashboards')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};