import { handlers as defaultHandlers } from '@mock-utils/api/mockApi';
import authApi from '@mock-utils/api/authApi';
import dashboardHandlers from '@mock-utils/api/dashboardHandlers';

// Combine all handlers
export const handlers = [
  ...defaultHandlers,
  ...authApi,
  ...dashboardHandlers
];