import { supabase } from '../supabase';

export const getAuditLogs = async (filters = {}) => {
  let query = supabase
    .from('audit_logs')
    .select('*, user:user_id(*)')
    .order('created_at', { ascending: false });
  
  // Apply filters if they exist
  if (filters.action) query = query.eq('action', filters.action);
  if (filters.user_id) query = query.eq('user_id', filters.user_id);
  if (filters.from_date) query = query.gte('created_at', filters.from_date);
  if (filters.to_date) query = query.lte('created_at', filters.to_date);
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

export const getIncidentReports = async () => {
  const { data, error } = await supabase
    .from('incident_reports')
    .select('*, reported_by(*)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createIncidentReport = async (reportData) => {
  const { data, error } = await supabase
    .from('incident_reports')
    .insert([reportData]);
  
  if (error) throw error;
  return data;
};

export const getISOComplianceStatus = async () => {
  const { data, error } = await supabase
    .from('iso_compliance')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (error) throw error;
  return data?.[0] || null;
};