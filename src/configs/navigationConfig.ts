import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

const navigationConfig: FuseNavItemType[] = [
	{
		id: 'dashboard',
		title: 'Dashboard',
		type: 'group',
		children: [
			{
				id: 'summary',
				title: 'Summary',
				type: 'item',
				icon: 'heroicons-outline:view-grid',
				url: '/dashboard/executive-summary'
			},
			{
				id: 'ai-insights',
				title: 'AI Insights',
				type: 'item',
				icon: 'heroicons-outline:light-bulb',
				url: '/dashboard/ai-insights'
			},
			{ 
				id: 'alerts', 
				title: 'Alerts', 
				type: 'item', 
				icon: 'heroicons-outline:bell', 
				url: '/dashboard/alerts' 
			},
			{
				id: 'custom-dashboards',
				title: 'Custom Dashboards',
				type: 'item',
				icon: 'heroicons-outline:adjustments',
				url: '/dashboard/custom-dashboards'
			},
			{
				id: 'saved-views',
				title: 'Saved Views',
				type: 'item',
				icon: 'heroicons-outline:bookmark',
				url: '/dashboard/saved-views'
			},
			{
				id: 'shared-dashboards',
				title: 'Shared Dashboards',
				type: 'item',
				icon: 'heroicons-outline:share',
				url: '/dashboard/shared-dashboards'
			}
		]
	},
	{
		id: 'administration',
		title: 'Administration',
		type: 'group',
		children: [
			{
				id: 'api-documentation',
				title: 'API Documentation',
				type: 'item',
				icon: 'heroicons-outline:document-text',
				url: '/admin/api-documentation'
				// This component will display the comprehensive API documentation
			},
			{
				id: 'user-management',
				title: 'User Management',
				type: 'collapse',
				icon: 'heroicons-outline:users',
				children: [
					{ 
						id: 'users', 
						title: 'Users', 
						type: 'item', 
						url: '/admin/users',
						translate: 'USERS',
						// This component will use the usersApi.js functions
					},
					{ 
						id: 'roles', 
						title: 'Roles & Permissions', 
						type: 'item', 
						url: '/admin/roles',
						// This component will use the rolesApi.js functions
					},
					{ 
						id: 'tenant-management', 
						title: 'Tenant Management', 
						type: 'item', 
						url: '/admin/tenants',
						// This component will use the tenantsApi.js functions 
					}
				]
			},
			{
				id: 'security',
				title: 'Security & Compliance',
				type: 'collapse',
				icon: 'heroicons-outline:shield-check',
				children: [
					{ 
						id: 'audit-logs', 
						title: 'Audit Logs', 
						type: 'item', 
						url: '/admin/security/audit-logs',
						// This component will use the securityApi.js functions for audit logs
					},
					{
						id: 'incident-reports',
						title: 'Incident Reports',
						type: 'item',
						url: '/admin/security/incidents',
						// This component will use the securityApi.js functions for incident reports
					},
					{
						id: 'iso-compliance',
						title: 'ISO Compliance',
						type: 'item',
						url: '/admin/security/iso-compliance',
						// This component will use the securityApi.js functions for ISO compliance
					}
				]
			},
			{
				id: 'billing',
				title: 'Subscription & Billing',
				type: 'collapse',
				icon: 'heroicons-outline:currency-dollar',
				children: [
					{ 
						id: 'plans', 
						title: 'Plans & Pricing', 
						type: 'item', 
						url: '/billing/plans',
						// This component will use the billingApi.js functions for plans
					},
					{ 
						id: 'usage', 
						title: 'Usage Tracking', 
						type: 'item', 
						url: '/billing/usage',
						// This component will use the billingApi.js functions for usage tracking
					},
					{ 
						id: 'invoices', 
						title: 'Invoices & Payments', 
						type: 'item', 
						url: '/billing/invoices',
						// This component will use the billingApi.js functions for invoices
					},
					{
						id: 'subscription-management',
						title: 'Subscription Management',
						type: 'item',
						url: '/billing/subscription-management',
						// This component will use the billingApi.js functions for subscription management
					}
				]
			}
		]
	},
	{
		id: 'operations',
		title: 'Production Operations',
		type: 'group',
		children: [
			{
				id: 'planning',
				title: 'Planning',
				type: 'item',
				icon: 'heroicons-outline:calendar',
				url: '/operations/planning',
				// This component will use the planningApi.js functions
			},
			{
				id: 'scheduling',
				title: 'Scheduling',
				type: 'item',
				icon: 'heroicons-outline:clock',
				url: '/operations/scheduling',
				// This component will use the schedulingApi.js functions
			},
			{
				id: 'resource-allocation',
				title: 'Resource Allocation',
				type: 'item',
				icon: 'heroicons-outline:collection',
				url: '/operations/resource-allocation',
				// This component will use the resourcesApi.js functions
			},
			{
				id: 'material-planning',
				title: 'Material Planning',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/operations/material-planning',
				// This component will use the materialsApi.js functions
			},
			{
				id: 'job-tracking',
				title: 'Job Tracking',
				type: 'item',
				icon: 'heroicons-outline:location-marker',
				url: '/operations/job-tracking',
				// This component will use the jobsApi.js functions
			},
			{
				id: 'real-time-status',
				title: 'Real-Time Status',
				type: 'item',
				icon: 'heroicons-outline:refresh',
				url: '/operations/real-time-status',
				// This component will use a combination of jobsApi.js and performanceApi.js functions
			},
			{
				id: 'performance-metrics',
				title: 'Performance Metrics',
				type: 'item',
				icon: 'heroicons-outline:chart-bar',
				url: '/operations/performance-metrics',
				// This component will use the performanceApi.js functions
			},
			{
				id: 'history',
				title: 'History',
				type: 'item',
				icon: 'heroicons-outline:clock',
				url: '/operations/history',
				// This component will use the performanceApi.js getHistoricalData function
			},
			{
				id: 'work-instructions',
				title: 'Work Instructions',
				type: 'item',
				icon: 'heroicons-outline:document-text',
				url: '/operations/work-instructions',
				// This component will use the workflowApi.js getWorkInstructions function
			},
			{
				id: 'workflow-automation',
				title: 'Workflow Automation',
				type: 'item',
				icon: 'heroicons-outline:cog',
				url: '/operations/workflow-automation',
				// This component will use the workflowApi.js functions for automation
			}
		]
	}
];

export default navigationConfig;