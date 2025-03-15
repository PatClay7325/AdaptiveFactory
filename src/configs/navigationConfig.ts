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
			{ id: 'alerts', title: 'Alerts', type: 'item', icon: 'heroicons-outline:bell', url: '/dashboard/alerts' },
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
				id: 'user-management',
				title: 'User Management',
				type: 'collapse',
				icon: 'heroicons-outline:users',
				children: [
					{ id: 'users', title: 'Users', type: 'item', url: '/admin/users' },
					{ id: 'roles', title: 'Roles & Permissions', type: 'item', url: '/admin/roles' },
					{ id: 'tenant-management', title: 'Tenant Management', type: 'item', url: '/admin/tenants' }
				]
			},
			{
				id: 'security',
				title: 'Security & Compliance',
				type: 'collapse',
				icon: 'heroicons-outline:shield-check',
				children: [
					{ id: 'audit-logs', title: 'Audit Logs', type: 'item', url: '/admin/security/audit-logs' },
					{
						id: 'incident-reports',
						title: 'Incident Reports',
						type: 'item',
						url: '/admin/security/incidents'
					},
					{
						id: 'iso-compliance',
						title: 'ISO Compliance',
						type: 'item',
						url: '/admin/security/iso-compliance'
					}
				]
			},
			{
				id: 'billing',
				title: 'Subscription & Billing',
				type: 'collapse',
				icon: 'heroicons-outline:currency-dollar',
				children: [
					{ id: 'plans', title: 'Plans & Pricing', type: 'item', url: '/billing/plans' },
					{ id: 'usage', title: 'Usage Tracking', type: 'item', url: '/billing/usage' },
					{ id: 'invoices', title: 'Invoices & Payments', type: 'item', url: '/billing/invoices' },
					{
						id: 'subscription-management',
						title: 'Subscription Management',
						type: 'item',
						url: '/billing/subscription-management'
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
				url: '/operations/planning'
			},
			{
				id: 'scheduling',
				title: 'Scheduling',
				type: 'item',
				icon: 'heroicons-outline:clock',
				url: '/operations/scheduling'
			},
			{
				id: 'resource-allocation',
				title: 'Resource Allocation',
				type: 'item',
				icon: 'heroicons-outline:collection',
				url: '/operations/resource-allocation'
			},
			{
				id: 'material-planning',
				title: 'Material Planning',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/operations/material-planning'
			},
			{
				id: 'job-tracking',
				title: 'Job Tracking',
				type: 'item',
				icon: 'heroicons-outline:location-marker',
				url: '/operations/job-tracking'
			},
			{
				id: 'real-time-status',
				title: 'Real-Time Status',
				type: 'item',
				icon: 'heroicons-outline:refresh',
				url: '/operations/real-time-status'
			},
			{
				id: 'performance-metrics',
				title: 'Performance Metrics',
				type: 'item',
				icon: 'heroicons-outline:chart-bar',
				url: '/operations/performance-metrics'
			},
			{
				id: 'history',
				title: 'History',
				type: 'item',
				icon: 'heroicons-outline:clock',
				url: '/operations/history'
			},
			{
				id: 'work-instructions',
				title: 'Work Instructions',
				type: 'item',
				icon: 'heroicons-outline:document-text',
				url: '/operations/work-instructions'
			},
			{
				id: 'workflow-automation',
				title: 'Workflow Automation',
				type: 'item',
				icon: 'heroicons-outline:cog',
				url: '/operations/workflow-automation'
			}
		]
	}
];

export default navigationConfig;
