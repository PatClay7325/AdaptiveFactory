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
				id: 'cloud-monitoring',
				title: 'Cloud Monitoring',
				type: 'item',
				icon: 'heroicons-outline:cloud',
				url: '/dashboard/cloud-monitoring'
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
					},
					{
						id: 'access-control',
						title: 'Access Control',
						type: 'item',
						url: '/admin/access-control',
						// This component will use the rolesApi.js and usersApi.js functions
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
			},
			{
				id: 'system-configuration',
				title: 'System Configuration',
				type: 'collapse',
				icon: 'heroicons-outline:cog',
				children: [
					{
						id: 'general-settings',
						title: 'General Settings',
						type: 'item',
						url: '/admin/settings/general'
					},
					{
						id: 'notification-settings',
						title: 'Notification Settings',
						type: 'item',
						url: '/admin/settings/notifications'
					},
					{
						id: 'backup-recovery',
						title: 'Backup & Recovery',
						type: 'item',
						url: '/admin/settings/backup'
					},
					{
						id: 'system-updates',
						title: 'System Updates',
						type: 'item',
						url: '/admin/settings/updates'
					},
					{
						id: 'database-config',
						title: 'Database Configuration',
						type: 'item',
						icon: 'heroicons-outline:server',
						url: '/admin/settings/database-config'
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
	},
	{
		id: 'quality',
		title: 'Quality Management',
		type: 'group',
		children: [
			{
				id: 'defect-rate',
				title: 'Defect Rate',
				type: 'item',
				icon: 'heroicons-outline:exclamation-circle',
				url: '/quality/defect-rate'
			},
			{
				id: 'first-pass-yield',
				title: 'First Pass Yield',
				type: 'item',
				icon: 'heroicons-outline:check-circle',
				url: '/quality/first-pass-yield'
			},
			{
				id: 'quality-compliance',
				title: 'Compliance & Audits',
				type: 'item',
				icon: 'heroicons-outline:clipboard-list',
				url: '/quality/compliance-audits'
			},
			{
				id: 'statistical-process-control',
				title: 'Statistical Process Control',
				type: 'item',
				icon: 'heroicons-outline:chart-square-bar',
				url: '/quality/statistical-process-control'
			},
			{
				id: 'quality-documentation',
				title: 'Quality Documentation',
				type: 'item',
				icon: 'heroicons-outline:document',
				url: '/quality/documentation'
			},
			{
				id: 'supplier-quality',
				title: 'Supplier Quality',
				type: 'item',
				icon: 'heroicons-outline:truck',
				url: '/quality/supplier-quality'
			},
			{
				id: 'corrective-actions',
				title: 'Corrective Actions',
				type: 'item',
				icon: 'heroicons-outline:arrow-circle-right',
				url: '/quality/corrective-actions'
			}
		]
	},
	{
		id: 'reliability',
		title: 'Reliability',
		type: 'group',
		children: [
			{
				id: 'predictive-analysis',
				title: 'Predictive Analysis',
				type: 'item',
				icon: 'heroicons-outline:trending-up',
				url: '/reliability/predictive-analysis'
			},
			{
				id: 'maintenance-programs',
				title: 'Maintenance Programs',
				type: 'item',
				icon: 'heroicons-outline:wrench',
				url: '/reliability/maintenance-programs'
			},
			{
				id: 'downtime-analysis',
				title: 'Downtime Analysis',
				type: 'item',
				icon: 'heroicons-outline:stop',
				url: '/reliability/downtime-analysis'
			},
			{
				id: 'root-cause-investigation',
				title: 'Root Cause Investigation',
				type: 'item',
				icon: 'heroicons-outline:search',
				url: '/reliability/root-cause-investigation'
			},
			{
				id: 'equipment-history',
				title: 'Equipment History',
				type: 'item',
				icon: 'heroicons-outline:archive',
				url: '/reliability/equipment-history'
			},
			{
				id: 'parts-inventory',
				title: 'Parts Inventory',
				type: 'item',
				icon: 'heroicons-outline:cube',
				url: '/reliability/parts-inventory'
			},
			{
				id: 'reliability-metrics',
				title: 'Reliability Metrics',
				type: 'item',
				icon: 'heroicons-outline:presentation-chart-line',
				url: '/reliability/reliability-metrics'
			}
		]
	},
	{
		id: 'safety',
		title: 'Safety',
		type: 'group',
		children: [
			{
				id: 'safety-reports',
				title: 'Safety Reports',
				type: 'item',
				icon: 'heroicons-outline:document-report',
				url: '/safety/reports'
			},
			{
				id: 'operator-performance',
				title: 'Operator Performance',
				type: 'item',
				icon: 'heroicons-outline:user-group',
				url: '/safety/operator-performance'
			},
			{
				id: 'safety-training',
				title: 'Training Programs',
				type: 'item',
				icon: 'heroicons-outline:academic-cap',
				url: '/safety/training'
			},
			{
				id: 'incident-management',
				title: 'Incident Management',
				type: 'item',
				icon: 'heroicons-outline:flag',
				url: '/safety/incident-management'
			},
			{
				id: 'safety-audits',
				title: 'Safety Audits',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check',
				url: '/safety/audits'
			},
			{
				id: 'risk-assessments',
				title: 'Risk Assessments',
				type: 'item',
				icon: 'heroicons-outline:scale',
				url: '/safety/risk-assessments'
			},
			{
				id: 'ppe-compliance',
				title: 'PPE Compliance',
				type: 'item',
				icon: 'heroicons-outline:shield-check',
				url: '/safety/ppe-compliance'
			}
		]
	},
	{
		id: 'financial',
		title: 'Financial',
		type: 'group',
		children: [
			{
				id: 'cost-per-unit',
				title: 'Cost per Unit',
				type: 'item',
				icon: 'heroicons-outline:currency-dollar',
				url: '/financial/cost-per-unit'
			},
			{
				id: 'profitability-insights',
				title: 'Profitability Insights',
				type: 'item',
				icon: 'heroicons-outline:chart-pie',
				url: '/financial/profitability-insights'
			},
			{
				id: 'operational-expenses',
				title: 'Operational Expenses',
				type: 'item',
				icon: 'heroicons-outline:calculator',
				url: '/financial/operational-expenses'
			},
			{
				id: 'budget-planning',
				title: 'Budget Planning',
				type: 'item',
				icon: 'heroicons-outline:cash',
				url: '/financial/budget-planning'
			},
			{
				id: 'financial-forecasting',
				title: 'Financial Forecasting',
				type: 'item',
				icon: 'heroicons-outline:trending-up',
				url: '/financial/forecasting'
			},
			{
				id: 'roi-analysis',
				title: 'ROI Analysis',
				type: 'item',
				icon: 'heroicons-outline:presentation-chart-bar',
				url: '/financial/roi-analysis'
			},
			{
				id: 'investment-tracking',
				title: 'Investment Tracking',
				type: 'item',
				icon: 'heroicons-outline:briefcase',
				url: '/financial/investment-tracking'
			}
		]
	},
	{
		id: 'app-builder',
		title: 'App Builder',
		type: 'group',
		children: [
			{
				id: 'process-designer',
				title: 'Process Designer',
				type: 'item',
				icon: 'heroicons-outline:template',
				url: '/app-builder/process-designer'
			},
			{
				id: 'form-builder',
				title: 'Form Builder',
				type: 'item',
				icon: 'heroicons-outline:document-add',
				url: '/app-builder/form-builder'
			},
			{
				id: 'workflow-editor',
				title: 'Workflow Editor',
				type: 'item',
				icon: 'heroicons-outline:switch-horizontal',
				url: '/app-builder/workflow-editor'
			},
			{
				id: 'app-templates',
				title: 'App Templates',
				type: 'item',
				icon: 'heroicons-outline:duplicate',
				url: '/app-builder/app-templates'
			},
			{
				id: 'app-deployment',
				title: 'App Deployment',
				type: 'item',
				icon: 'heroicons-outline:upload',
				url: '/app-builder/app-deployment'
			},
			{
				id: 'version-control',
				title: 'Version Control',
				type: 'item',
				icon: 'heroicons-outline:refresh',
				url: '/app-builder/version-control'
			}
		]
	},
	{
		id: 'integrations',
		title: 'Integrations',
		type: 'group',
		children: [
			{
				id: 'erp-mes-sync',
				title: 'ERP & MES Sync',
				type: 'item',
				icon: 'heroicons-outline:refresh',
				url: '/integrations/erp-mes-sync'
			},
			{
				id: 'iso-reports',
				title: 'ISO Reports',
				type: 'item',
				icon: 'heroicons-outline:document-report',
				url: '/integrations/iso-reports'
			},
			{
				id: 'data-exports',
				title: 'Data Exports',
				type: 'item',
				icon: 'heroicons-outline:download',
				url: '/integrations/data-exports'
			},
			{
				id: 'api-management',
				title: 'API Management',
				type: 'item',
				icon: 'heroicons-outline:code',
				url: '/integrations/api-management'
			},
			{
				id: 'integration-status',
				title: 'Integration Status',
				type: 'item',
				icon: 'heroicons-outline:status-online',
				url: '/integrations/integration-status'
			},
			{
				id: 'third-party-connections',
				title: 'Third-party Connections',
				type: 'item',
				icon: 'heroicons-outline:link',
				url: '/integrations/third-party-connections'
			},
			{
				id: 'data-mapping',
				title: 'Data Mapping',
				type: 'item',
				icon: 'heroicons-outline:map',
				url: '/integrations/data-mapping'
			},
			{
				id: 'machine-connectivity',
				title: 'Machine Connectivity',
				type: 'item',
				icon: 'heroicons-outline:desktop-computer',
				url: '/integrations/machine-connectivity'
			},
			{
				id: 'iot-integration',
				title: 'IoT Integration',
				type: 'item',
				icon: 'heroicons-outline:chip',
				url: '/integrations/iot-integration'
			}
		]
	},
	{
		id: 'academy',
		title: 'Academy',
		type: 'group',
		children: [
			{
				id: 'courses',
				title: 'Courses',
				type: 'item',
				icon: 'heroicons-outline:book-open',
				url: '/academy/courses'
			},
			{
				id: 'certifications',
				title: 'Certifications',
				type: 'item',
				icon: 'heroicons-outline:badge-check',
				url: '/academy/certifications'
			},
			{
				id: 'training-calendar',
				title: 'Training Calendar',
				type: 'item',
				icon: 'heroicons-outline:calendar',
				url: '/academy/training-calendar'
			},
			{
				id: 'learning-paths',
				title: 'Learning Paths',
				type: 'item',
				icon: 'heroicons-outline:academic-cap',
				url: '/academy/learning-paths'
			},
			{
				id: 'resources-library',
				title: 'Resources Library',
				type: 'item',
				icon: 'heroicons-outline:library',
				url: '/academy/resources-library'
			}
		]
	},
	{
		id: 'help-center',
		title: 'Help Center',
		type: 'group',
		children: [
			{
				id: 'faqs',
				title: 'FAQs',
				type: 'item',
				icon: 'heroicons-outline:question-mark-circle',
				url: '/help/faqs'
			},
			{
				id: 'knowledge-base',
				title: 'Knowledge Base',
				type: 'item',
				icon: 'heroicons-outline:book-open',
				url: '/help/knowledge-base'
			},
			{
				id: 'support-tickets',
				title: 'Support Tickets',
				type: 'item',
				icon: 'heroicons-outline:ticket',
				url: '/help/support-tickets'
			},
			{
				id: 'user-guides',
				title: 'User Guides',
				type: 'item',
				icon: 'heroicons-outline:document-text',
				url: '/help/user-guides'
			},
			{
				id: 'community-forum',
				title: 'Community Forum',
				type: 'item',
				icon: 'heroicons-outline:chat-alt',
				url: '/help/community-forum'
			}
		]
	},
	{
		id: 'system-monitoring',
		title: 'System Monitoring',
		type: 'group',
		children: [
			{
				id: 'error-logs',
				title: 'Error Logs',
				type: 'item',
				icon: 'heroicons-outline:exclamation',
				url: '/monitoring/error-logs'
			},
			{
				id: 'system-status',
				title: 'System Status',
				type: 'item',
				icon: 'heroicons-outline:status-online',
				url: '/monitoring/system-status'
			},
			{
				id: 'troubleshooting-tools',
				title: 'Troubleshooting Tools',
				type: 'item',
				icon: 'heroicons-outline:wrench',
				url: '/monitoring/troubleshooting-tools'
			},
			{
				id: 'issue-reporting',
				title: 'Issue Reporting',
				type: 'item',
				icon: 'heroicons-outline:flag',
				url: '/monitoring/issue-reporting'
			}
		]
	},
	{
		id: 'file-manager',
		title: 'File Manager',
		type: 'collapse',
		icon: 'heroicons-outline:folder',
		children: [
			{
				id: 'my-documents',
				title: 'My Documents',
				type: 'item',
				url: '/files/my-documents'
			},
			{
				id: 'shared-files',
				title: 'Shared Files',
				type: 'item',
				url: '/files/shared'
			},
			{
				id: 'templates',
				title: 'Templates',
				type: 'item',
				url: '/files/templates'
			},
			{
				id: 'archives',
				title: 'Archives',
				type: 'item',
				url: '/files/archives'
			}
		]
	},
	{
		id: 'search',
		title: 'Search',
		type: 'item',
		icon: 'heroicons-outline:search',
		url: '/search'
	},
	{
		id: 'profile',
		title: 'Profile',
		type: 'item',
		icon: 'heroicons-outline:user-circle',
		url: '/profile'
	},
	{
		id: 'mail',
		title: 'Mail',
		type: 'collapse',
		icon: 'heroicons-outline:mail',
		children: [
			{
				id: 'inbox',
				title: 'Inbox',
				type: 'item',
				url: '/mail/inbox'
			},
			{
				id: 'sent',
				title: 'Sent Items',
				type: 'item',
				url: '/mail/sent'
			},
			{
				id: 'drafts',
				title: 'Drafts',
				type: 'item',
				url: '/mail/drafts'
			},
			{
				id: 'templates',
				title: 'Templates',
				type: 'item',
				url: '/mail/templates'
			}
		]
	},
	{
		id: 'pricing',
		title: 'Pricing',
		type: 'item',
		icon: 'heroicons-outline:currency-dollar',
		url: '/pricing'
	},
	{
		id: 'roadmap',
		title: 'Roadmap',
		type: 'item',
		icon: 'heroicons-outline:map',
		url: '/roadmap'
	},
	{
		id: 'error-page',
		title: 'Error Page',
		type: 'item',
		icon: 'heroicons-outline:exclamation-circle',
		url: '/error'
	}
];

// First, declare the default export (this is critical for module resolution)
export default navigationConfig;

// Then provide the named export as well
export { navigationConfig };