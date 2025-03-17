import '@i18n/i18n';
import './styles/app-base.css';
import './styles/app-components.css';
import './styles/app-utilities.css';
// Import Highcharts Dashboards CSS
import '@highcharts/dashboards/css/dashboards.css';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import routes from '@/configs/routesConfig';
import { worker } from '@mock-utils/mswMockAdapter';
import { API_BASE_URL } from '@/utils/apiFetch';
import { Suspense } from 'react';

// Try to import datagrid CSS, but handle potential errors
try {
  import('@highcharts/dashboards/css/datagrid.css')
    .catch(e => console.warn('Could not load datagrid CSS:', e));
} catch (e) {
  console.warn('Error importing datagrid CSS', e);
}

/**
 * The root element of the application.
 */
const container = document.getElementById('app');

if (!container) {
	console.error('❌ Failed to find the root element.');
	throw new Error('Root element not found.');
}

// ✅ Ensure `routes` is valid, fallback to NotFound page
const safeRoutes = Array.isArray(routes) && routes.length > 0
	? routes
	: [{ path: '*', element: <h1 style={{ textAlign: 'center', marginTop: '50px' }}>404 - Page Not Found</h1> }];

// ✅ Initialize Mock API (Only in Development)
const initMockAPI = async () => {
	if (import.meta.env.DEV && worker) {
		try {
			await worker.start({
				onUnhandledRequest: 'bypass',
				serviceWorker: {
					url: `${API_BASE_URL || ''}/mockServiceWorker.js`
				}
			});
			console.info('✅ MSW Mock API started.');
		} catch (err) {
			console.error('❌ MSW initialization failed:', err);
		}
	} else {
		console.info('ℹ️ MSW is disabled in production.');
	}
};

// ✅ Initialize Application
const initApp = async () => {
	try {
		await initMockAPI();

		// ✅ Ensure `createRoot` is only called once
		const root = createRoot(container);

		const router = createBrowserRouter(safeRoutes);

		root.render(
			<Suspense fallback={<h1 style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</h1>}>
				<RouterProvider router={router} />
			</Suspense>
		);
	} catch (err) {
		console.error('❌ Application initialization failed:', err);
	}
};

// 🚀 Start Application
initApp();