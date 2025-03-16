import { setupWorker } from 'msw/browser';
import { handlers as originalHandlers } from '@/mocks/handlers';
import dashboardHandlers from '../api/mock/dashboardHandlers';

// Combine all handlers - using the default export
const allHandlers = [...originalHandlers, ...dashboardHandlers];

// Ensure MSW is only initialized in development
export const worker = import.meta.env.DEV ? setupWorker(...allHandlers) : null;