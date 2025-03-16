import { supabase } from '../supabase';
import { API_CONFIG } from '../config';

export const getAlerts = async (status = 'active') => {
  if (!API_CONFIG.USE_REAL_API) {
    try {
      console.log('Using mock API for getAlerts');
      const response = await fetch(`/api/dashboard/alerts?status=${status}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching alerts from mock API:', error);
      throw error;
    }
  } else {
    // Real Supabase implementation
    try {
      console.log('Using Supabase for getAlerts');
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('status', status)
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching alerts from Supabase:', error);
      throw error;
    }
  }
};

export const markAlertAsRead = async (alertId) => {
  if (!API_CONFIG.USE_REAL_API) {
    try {
      console.log('Using mock API for markAlertAsRead');
      const response = await fetch(`/api/dashboard/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error marking alert as read in mock API:', error);
      throw error;
    }
  } else {
    // Real Supabase implementation
    try {
      console.log('Using Supabase for markAlertAsRead');
      const { data, error } = await supabase
        .from('alerts')
        .update({ status: 'read' })
        .eq('id', alertId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error marking alert as read in Supabase:', error);
      throw error;
    }
  }
};