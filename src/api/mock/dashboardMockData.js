export const dashboardMockData = {
  summary: {
    id: "summary-1",
    overview_text: "Overall business performance has improved by 15% compared to last quarter. Revenue streams are trending upward, while operational costs have decreased by 8%. Customer acquisition cost has dropped significantly, and user engagement metrics show positive growth across all product lines.",
    highlights: [
      { title: "Revenue", value: "$1,458,500", trend: "+15%", color: "green" },
      { title: "Active Users", value: "24,738", trend: "+8%", color: "green" },
      { title: "Avg. Session Time", value: "4m 36s", trend: "+12%", color: "green" },
      { title: "Cost Reduction", value: "8%", trend: "-8%", color: "green" },
      { title: "Customer Retention", value: "94.2%", trend: "+2.1%", color: "green" },
      { title: "Support Tickets", value: "156", trend: "-23%", color: "green" }
    ],
    performance_score: 85,
    created_at: "2025-03-15T08:00:00.000Z",
    last_updated: "2025-03-16T14:30:00.000Z"
  },
  
  metrics: [
    {
      id: "metric-1",
      name: "Revenue",
      value: "$1,458,500",
      trend: 15,
      description: "Total revenue for current period",
      time_range: "month"
    },
    {
      id: "metric-2",
      name: "Active Users",
      value: "24,738",
      trend: 8,
      description: "Total number of active users",
      time_range: "month"
    },
    {
      id: "metric-3",
      name: "Conversion Rate",
      value: "3.8%",
      trend: 0.5,
      description: "Visitor to customer conversion rate",
      time_range: "month"
    },
    {
      id: "metric-4",
      name: "Avg. Session Time",
      value: "4m 36s",
      trend: 12,
      description: "Average user session duration",
      time_range: "month"
    }
  ],
  
  alerts: [
    {
      id: "alert-1",
      message: "Server load has exceeded 85% for the past hour",
      details: "High traffic is causing increased server load. Consider scaling resources if this trend continues.",
      priority: "high",
      status: "active",
      created_at: "2025-03-16T10:45:00.000Z"
    },
    {
      id: "alert-2",
      message: "New security patch available for deployment",
      details: "Critical security update available. Schedule maintenance window for deployment.",
      priority: "medium",
      status: "active",
      created_at: "2025-03-16T09:30:00.000Z"
    },
    {
      id: "alert-3",
      message: "Customer satisfaction score dropped 5% this week",
      details: "Recent product changes may have impacted user experience. Review feedback and metrics.",
      priority: "medium",
      status: "active",
      created_at: "2025-03-15T14:15:00.000Z"
    }
  ]
};