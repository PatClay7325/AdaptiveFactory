import { setupWorker } from 'msw';
import { dashboardHandlers } from './dashboardHandlers';
import { databaseHandlers } from './databaseHandlers';

// Combine all handlers
export const handlers = [
  ...databaseHandlers, // Put database handlers first to ensure higher priority
  ...dashboardHandlers
];

// Log all registered handlers for debugging
console.log('MSW: Registering handlers:', 
  handlers.map(handler => `${handler.method} ${handler.path}`));

// Initialize MSW
export const worker = setupWorker(...handlers);