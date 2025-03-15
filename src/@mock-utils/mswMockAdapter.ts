import { setupWorker } from 'msw/browser';
import { handlers } from '@/mocks/handlers';

// Ensure MSW is only initialized in development
export const worker = import.meta.env.DEV ? setupWorker(...handlers) : null;
