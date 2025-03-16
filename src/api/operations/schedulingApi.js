import { supabase } from '../supabase';

export const getSchedules = async (filters = {}) => {
  let query = supabase
    .from('schedules')
    .select('*, resources(*)');
  
  if (filters.date) query = query.eq('date', filters.date);
  if (filters.resource_id) query = query.eq('resource_id', filters.resource_id);
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

export const createScheduleItem = async (scheduleData) => {
  const { data, error } = await supabase
    .from('schedules')
    .insert([scheduleData]);
  
  if (error) throw error;
  return data;
};

export const updateScheduleItem = async (id, scheduleData) => {
  const { data, error } = await supabase
    .from('schedules')
    .update(scheduleData)
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

export const deleteScheduleItem = async (id) => {
  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};