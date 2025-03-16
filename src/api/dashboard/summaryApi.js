// src/api/dashboard/summaryApi.js
import { supabase } from '../supabase';
import { API_CONFIG } from '../config';

export const getSummaryData = async () => {
  if (!API_CONFIG.USE_REAL_API) {
    try {
      console.log('Using mock API for getSummaryData');
      const response = await fetch('/api/dashboard/summary');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching summary data from mock API:', error);
      throw error;
    }
  } else {
    // Real Supabase implementation
    try {
      console.log('Using Supabase for getSummaryData');
      const { data, error } = await supabase
        .from('dashboard_summary')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching summary data from Supabase:', error);
      throw error;
    }
  }
};

export const getKeyMetrics = async (timeRange = 'week') => {
  if (!API_CONFIG.USE_REAL_API) {
    try {
      console.log('Using mock API for getKeyMetrics');
      const response = await fetch(`/api/dashboard/metrics?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching metrics data from mock API:', error);
      throw error;
    }
  } else {
    // Real Supabase implementation
    try {
      console.log('Using Supabase for getKeyMetrics');
      const { data, error } = await supabase
        .from('key_metrics')
        .select('*')
        .eq('time_range', timeRange);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching key metrics from Supabase:', error);
      throw error;
    }
  }
};