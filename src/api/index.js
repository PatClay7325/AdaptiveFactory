// Main export file to simplify imports across the application

// Dashboard APIs
export * from './dashboard/summaryApi';
export * from './dashboard/insightsApi';
export * from './dashboard/alertsApi';
export * from './dashboard/dashboardsApi';
export * from './dashboard/savedViewsApi';
export * from './dashboard/sharedDashboardsApi';

// Administration APIs
export * from './admin/usersApi';
export * from './admin/rolesApi';
export * from './admin/tenantsApi';
export * from './admin/securityApi';
export * from './admin/billingApi';

// Operations APIs
export * from './operations/planningApi';
export * from './operations/schedulingApi';
export * from './operations/resourcesApi';
export * from './operations/materialsApi';
export * from './operations/jobsApi';
export * from './operations/performanceApi';
export * from './operations/workflowApi';

// Core Supabase exports
export * from './supabase';

// Configuration exports
export { API_CONFIG } from './config';