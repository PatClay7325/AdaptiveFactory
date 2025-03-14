import '@i18n/i18n';
import './styles/app-base.css';
import './styles/app-components.css';
import './styles/app-utilities.css';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import routes from 'src/configs/routesConfig';
import { worker } from '@mock-utils/mswMockAdapter';
import { API_BASE_URL } from '@/utils/apiFetch';

/**
 * The root element of the application.
 */
const container = document.getElementById('app');

if (!container) {
  throw new Error('Failed to find the root element');
}

// Initialize app with or without mock API based on environment
const initApp = async () => {
  // Only setup mocks in development environment
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: `${API_BASE_URL}/mockServiceWorker.js`
      }
    });
  }

  /**
   * The root component of the application.
   */
  const root = createRoot(container, {
    onUncaughtError: (error, errorInfo) => {
      console.error('UncaughtError error', error, errorInfo.componentStack);
    },
    onCaughtError: (error, errorInfo) => {
      console.error('Caught error', error, errorInfo.componentStack);
    }
  });

  const router = createBrowserRouter(routes);

  root.render(<RouterProvider router={router} />);
};

// Start the application
initApp();