import { lazy, Suspense } from 'react';
import { FuseRouteConfigType, FuseRoutesType } from '@fuse/utils/FuseUtils';

interface LocalFuseRouteConfigType {
  path: string;
  element?: React.ReactNode;
  children?: LocalFuseRouteConfigType[];
  auth?: any;
  errorElement?: React.ReactNode;
}

interface CustomFuseRouteConfigType {
  path: string;
  element?: React.ReactNode;
  children?: CustomFuseRouteConfigType[];
  auth?: any;
  errorElement?: React.ReactNode;
}

import { Navigate } from 'react-router';
import FuseLoading from '@fuse/core/FuseLoading';
import ErrorBoundary from '@fuse/utils/ErrorBoundary';
import App from 'src/app/App';
import Error404Page from 'src/app/(public)/404/Error404Page';
import Error401Page from 'src/app/(public)/401/Error401Page';

// ✅ Lazy load components
const ExecutiveSummary = lazy(() => import('src/pages/dashboard/executive-summary'));
const Dashboard = lazy(() => import('src/pages/Dashboard'));
const AIInsights = lazy(() => import('src/pages/AIInsights'));
const Alerts = lazy(() => import('src/pages/Alerts'));
const CustomDashboards = lazy(() => import('src/pages/CustomDashboards'));
const SavedViews = lazy(() => import('src/pages/SavedViews'));
const SharedDashboards = lazy(() => import('src/pages/SharedDashboards'));
const NotFound = lazy(() => import('src/pages/NotFound'));
const CloudMonitoring = lazy(() => import('src/pages/dashboard/cloud-monitoring'));

// ✅ Dashboard Builder Components
const DashboardList = lazy(() => import('src/components/dashboards/DashboardList'));
const DashboardBuilder = lazy(() => import('src/components/dashboards/builder/DashboardBuilder'));
const DashboardView = lazy(() => import('src/pages/DashboardView')); // TypeScript will resolve the extension

// ✅ Add API Documentation & Test pages
const ApiTest = lazy(() => import('src/pages/api-test'));
const ApiDocumentation = lazy(() => import('src/pages/admin/api-documentation/page'));

// ✅ Lazy load Supabase components
const SupabaseLogin = lazy(() => import('src/app/supabase/SupabaseLogin'));
const SupabaseDashboard = lazy(() => import('src/app/supabase/SupabaseDashboard'));

// ✅ Corrected Lazy Load for SettingsPage (previously DatabaseConfigPage)
const SettingsPage = lazy(() => import('src/pages/SettingsPage'));

// ✅ Add Under Development Page for placeholders
const UnderDevelopmentPage = lazy(() => import('src/pages/under-development/UnderDevelopmentPage'));

// ✅ Dynamically Import All Route Files
const configModules: Record<string, unknown> = import.meta.glob('/src/app/**/*Route.tsx', { eager: true });
const mainRoutes: CustomFuseRouteConfigType[] = Object.keys(configModules)
	.map((modulePath) => {
		const moduleConfigs = (configModules[modulePath] as { default: CustomFuseRouteConfigType | CustomFuseRouteConfigType[] }).default;
		return Array.isArray(moduleConfigs) ? moduleConfigs : [moduleConfigs];
	})
	.flat();

// ✅ Ensure all dynamically imported routes are auth-free
const updatedMainRoutes = mainRoutes.map(route => ({
	...route,
	auth: null // Override auth to null for all routes
}));

// ✅ Define Supabase routes
const supabaseRoutes: LocalFuseRouteConfigType[] = [
	{
		path: 'supabase',
		children: [
			{
				path: '',
				element: <Navigate to="login" />,
				auth: null
			},
			{
				path: 'login',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<SupabaseLogin />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'dashboard',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<SupabaseDashboard />
					</Suspense>
				),
				auth: null
			}
		]
	}
];

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
				element: <Navigate to="/supabase/login" />, // ✅ Redirect to Supabase Login Page
				auth: null
			},
			...updatedMainRoutes, // ✅ Include dynamically imported routes
			...supabaseRoutes, // ✅ Include Supabase routes
            
			// ✅ ADD DASHBOARD BUILDER ROUTES
			{
				path: 'dashboards',
				children: [
					{
						path: '',
						element: (
							<Suspense fallback={<FuseLoading />}>
								<DashboardList />
							</Suspense>
						),
						auth: null
					},
					{
						path: 'builder',
						element: (
							<Suspense fallback={<FuseLoading />}>
								<DashboardBuilder />
							</Suspense>
						),
						auth: null
					},
					{
						path: 'builder/:slug',
						element: (
							<Suspense fallback={<FuseLoading />}>
								<DashboardBuilder />
							</Suspense>
						),
						auth: null
					},
					{
						path: 'view/:slug',
						element: (
							<Suspense fallback={<FuseLoading />}>
								<DashboardView />
							</Suspense>
						),
						auth: null
					}
				]
			},
            
			{
				path: 'dashboard/executive-summary',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<ExecutiveSummary />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'dashboard/cloud-monitoring',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<CloudMonitoring />
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
			// ✅ Add API Documentation route
			{
				path: 'admin/api-documentation',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<ApiDocumentation />
					</Suspense>
				),
				auth: null
			},
			// ✅ Add API Test route
			{
				path: 'api-test',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<ApiTest />
					</Suspense>
				),
				auth: null
			},
			// ✅ Add Database Configuration route (now using SettingsPage)
			{
				path: 'admin/settings/database-config',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<SettingsPage />
					</Suspense>
				),
				auth: null
			},
			// ✅ Add placeholder routes for common navigation links
			// Add your missing routes here with the UnderDevelopmentPage
			{
				path: 'admin/users',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<UnderDevelopmentPage title="User Management" version={''} estimatedCompletion={undefined} contactEmail={''} docsUrl={''} pageId={''} />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'admin/roles',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<UnderDevelopmentPage title="Role Management" version={''} estimatedCompletion={undefined} contactEmail={''} docsUrl={''} pageId={''} />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'admin/settings',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<UnderDevelopmentPage title="Settings" version={''} estimatedCompletion={undefined} contactEmail={''} docsUrl={''} pageId={''} />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'reports',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<UnderDevelopmentPage title="Reports" version={''} estimatedCompletion={undefined} contactEmail={''} docsUrl={''} pageId={''} />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'analytics',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<UnderDevelopmentPage title="Analytics" version={''} estimatedCompletion={undefined} contactEmail={''} docsUrl={''} pageId={''} />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'notifications',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<UnderDevelopmentPage title="Notifications" version={''} estimatedCompletion={undefined} contactEmail={''} docsUrl={''} pageId={''} />
					</Suspense>
				),
				auth: null
			},
			{
				path: 'profile',
				element: (
					<Suspense fallback={<FuseLoading />}>
						<UnderDevelopmentPage title="User Profile" version={''} estimatedCompletion={undefined} contactEmail={''} docsUrl={''} pageId={''} />
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
	// ✅ MODIFIED: Using UnderDevelopmentPage instead of redirecting to 404
	{
		path: '*',
		element: (
			<Suspense fallback={<FuseLoading />}>
				<UnderDevelopmentPage title="Page Under Development" version={''} estimatedCompletion={undefined} contactEmail={''} docsUrl={''} pageId={''} />
			</Suspense>
		),
		auth: null
	}
];

export default routes;