// mswMockAdapter.ts - UPDATED VERSION
import { setupWorker } from 'msw/browser';
import authApi from './api/authApi';

// Only create and export the worker in development mode
let worker: ReturnType<typeof setupWorker> | null = null;

// Check if we're in development environment
if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
  // This configures a Service Worker with the given request handlers.
  worker = setupWorker(...[...authApi]);
}

export { worker };