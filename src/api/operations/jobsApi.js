import { supabase } from '../supabase';

export const getJobs = async (status = null) => {
  let query = supabase
    .from('jobs')
    .select('*');
  
  if (status) query = query.eq('status', status);
  
  const { data, error } = await query.order('priority', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getJobById = async (id) => {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      material_requirements(*, material(*)),
      job_steps(*),
      assigned_resources:resource_allocation(*, resource(*))
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateJobStatus = async (id, status, statusData = {}) => {
  const { data, error } = await supabase
    .from('jobs')
    .update({ 
      status,
      ...statusData,
      status_updated_at: new Date()
    })
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

export const trackJobProgress = async (jobId, progressData) => {
  const { data, error } = await supabase
    .from('job_tracking')
    .insert([{
      job_id: jobId,
      ...progressData,
      tracked_at: new Date()
    }]);
  
  if (error) throw error;
  return data;
};