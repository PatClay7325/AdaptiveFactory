// Dynamically import all *ConfigConfig.tsx files from the app folder
import { FuseRouteConfigType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import { Navigate } from 'react-router';
import FuseLoading from '@fuse/core/FuseLoading';
import ErrorBoundary from '@fuse/utils/ErrorBoundary';
import { layoutConfigOnlyMain } from './layoutConfigTemplates';
import settingsConfig from './settingsConfig';
import App from '@/app/App';
import Error404Page from '@/app/(public)/404/Error404Page';
import Error401Page from '@/app/(public)/401/Error401Page';

const configModules: Record<string, unknown> = import.meta.glob('/src/app/**/*Route.tsx', {
	eager: true
});

const mainRoutes: FuseRouteConfigType[] = Object.keys(configModules)
	.map((modulePath) => {
		const moduleConfigs = (configModules[modulePath] as { default: FuseRouteConfigType | FuseRouteConfigType[] })
			.default;
		return Array.isArray(moduleConfigs) ? moduleConfigs : [moduleConfigs];
	})
	.flat();

// Update each route in mainRoutes to bypass auth
const updatedMainRoutes = mainRoutes.map(route => ({
	...route,
	auth: null // Override auth to null for all routes
}));

const routes: FuseRoutesType = [
	{
		path: '/',
		element: <App />,
		auth: null, // Changed from settingsConfig.defaultAuth to null
		errorElement: <ErrorBoundary />,
		children: [
			{
				path: '/',
				element: <Navigate to="/example" />,
				auth: null // Ensure the redirect is also not auth protected
			},
			...updatedMainRoutes, // Use the updated routes with auth: null
			{
				path: 'loading',
				element: <FuseLoading />,
				settings: { layout: layoutConfigOnlyMain },
				auth: null // Set auth to null
			},
			{
				path: '401',
				element: <Error401Page />,
				auth: null // Set auth to null
			},
			{
				path: '404',
				element: <Error404Page />,
				settings: { layout: layoutConfigOnlyMain },
				auth: null
			}
		]
	},
	{
		path: '*',
		element: <Navigate to="/404" />,
		auth: null // Set auth to null
	}
];

export default routes;