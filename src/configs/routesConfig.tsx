import { lazy, Suspense } from 'react';
import { FuseRouteConfigType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import { Navigate } from 'react-router';
import FuseLoading from '@fuse/core/FuseLoading';
import ErrorBoundary from '@fuse/utils/ErrorBoundary';
import App from '@/app/App';
import Error404Page from '@/app/(public)/404/Error404Page';
import Error401Page from '@/app/(public)/401/Error401Page';

// ✅ Lazy load components
const ExecutiveSummary = lazy(() => import('@fuse/core/DemoContent/ExecutiveSummary'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const AIInsights = lazy(() => import('@/pages/AIInsights'));
const Alerts = lazy(() => import('@/pages/Alerts'));
const CustomDashboards = lazy(() => import('@/pages/CustomDashboards'));
const SavedViews = lazy(() => import('@/pages/SavedViews'));
const SharedDashboards = lazy(() => import('@/pages/SharedDashboards'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// ✅ Dynamically Import All Route Files
const configModules: Record<string, unknown> = import.meta.glob('/src/app/**/*Route.tsx', { eager: true });
const mainRoutes: FuseRouteConfigType[] = Object.keys(configModules)
	.map((modulePath) => {
		const moduleConfigs = (configModules[modulePath] as { default: FuseRouteConfigType | FuseRouteConfigType[] }).default;
		return Array.isArray(moduleConfigs) ? moduleConfigs : [moduleConfigs];
	})
	.flat();

// ✅ Ensure all dynamically imported routes are auth-free
const updatedMainRoutes = mainRoutes.map(route => ({
	...route,
	auth: null // Override auth to null for all routes
}));

// ✅ Define routes structure
const routes: FuseRoutesType = [
	{
		path: '/',
		element: <App />,
		auth: null, // ✅ Ensures App-level auth is disabled
		errorElement: <ErrorBoundary />,
		children: [
			{
				path: '/',
				element: <Navigate to="/dashboard/executive-summary" />, // ✅ Redirect to Default Page
				auth: null
			},
			...updatedMainRoutes, // ✅ Include dynamically imported routes
			{
				path: 'dashboard/executive-summary', // ✅ Executive Summary route
				element: (
					<Suspense fallback={<FuseLoading />}>
						<ExecutiveSummary />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'dashboard',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<Dashboard />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'ai-insights',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<AIInsights />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'alerts',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<Alerts />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'custom-dashboards',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<CustomDashboards />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'saved-views',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<SavedViews />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'shared-dashboards',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<SharedDashboards />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'loading',
				element: <FuseLoading />,
				auth: null
			},
			{
				path: '401',
				element: <Error401Page />,
				auth: null
			},
			{
				path: '404',
				element: <Error404Page />,
				auth: null
			}
		]
	},
	{
		path: '*',
		element: <Navigate to="/404" />,
		auth: null
	}
];

export default routes;