// src/api/mock/dashboardHandlers.ts
import { http, HttpResponse } from 'msw';
import { dashboardMockData } from 'src/api/mock/dashboardMockData';
export const dashboardHandlers = [
  // Summary data endpoint
  http.get('/api/dashboard/summary', () => {
    console.log('MSW: Intercepted GET /api/dashboard/summary');
    // Make sure we're returning a valid JSON object
    return HttpResponse.json(dashboardMockData.summary);
  }),

  // Metrics endpoint
  http.get('/api/dashboard/metrics', ({ request }) => {
    console.log('MSW: Intercepted GET /api/dashboard/metrics');
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || 'month';
    
    // Filter metrics by time_range
    const filteredMetrics = dashboardMockData.metrics.filter(
      metric => timeRange === 'all' || metric.time_range === timeRange
    );
    
    return HttpResponse.json(filteredMetrics);
  }),

  // Alerts endpoint
  http.get('/api/dashboard/alerts', ({ request }) => {
    console.log('MSW: Intercepted GET /api/dashboard/alerts');
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'active';
    
    // Filter alerts by status
    const filteredAlerts = dashboardMockData.alerts.filter(
      alert => status === 'all' || alert.status === status
    );
    
    return HttpResponse.json(filteredAlerts);
  }),

  // Mark alert as read endpoint
  http.patch('/api/dashboard/alerts/:alertId', ({ params }) => {
    console.log(`MSW: Intercepted PATCH /api/dashboard/alerts/${params.alertId}`);
    const alertId = params.alertId as string;
    
    // Find and update alert in our mock data
    const alertIndex = dashboardMockData.alerts.findIndex(alert => alert.id === alertId);
    
    if (alertIndex !== -1) {
      dashboardMockData.alerts[alertIndex].status = 'read';
      return HttpResponse.json(dashboardMockData.alerts[alertIndex]);
    }
    
    return HttpResponse.json({ error: 'Alert not found' }, { status: 404 });
  })
];

export default dashboardHandlers;