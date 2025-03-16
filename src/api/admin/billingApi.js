import { supabase } from '../supabase';

export const getPlans = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const getUsageData = async (tenantId, timeRange = 'month') => {
  const { data, error } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('time_range', timeRange);
  
  if (error) throw error;
  return data;
};

export const getInvoices = async (tenantId) => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('invoice_date', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getSubscriptionDetails = async (tenantId) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, plan(*)')
    .eq('tenant_id', tenantId)
    .single();
  
  if (error) throw error;
  return data;
};