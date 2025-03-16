import { supabase } from '../supabase';

export const getSharedDashboards = async () => {
  const { data, error } = await supabase
    .from('shared_dashboards')
    .select('*, shared_by(*), dashboard:dashboard_id(*)');
  
  if (error) throw error;
  return data;
};

export const shareDashboard = async (dashboardId, sharedWithIds) => {
  const shareData = sharedWithIds.map(userId => ({
    dashboard_id: dashboardId,
    shared_with: userId
  }));
  
  const { data, error } = await supabase
    .from('dashboard_shares')
    .insert(shareData);
  
  if (error) throw error;
  return data;
};

export const removeSharing = async (shareId) => {
  const { error } = await supabase
    .from('dashboard_shares')
    .delete()
    .eq('id', shareId);
  
  if (error) throw error;
  return true;
};