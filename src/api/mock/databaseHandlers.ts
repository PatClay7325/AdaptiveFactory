import { http, HttpResponse } from 'msw';

console.log('Loading database handlers module');

export const databaseHandlers = [
  // Use a more flexible pattern match for the config endpoint
  http.get('*/api/config', () => {
    console.log('MSW: Intercepted GET to /api/config with wildcard match');
    return HttpResponse.json({
      DATABASE_URL: "postgresql://postgres:password@localhost:5432/my_local_db"
    });
  }),
  
  // Use a more flexible pattern for the POST endpoint
  http.post('*/api/config', async ({ request }) => {
    console.log('MSW: Intercepted POST to /api/config with wildcard match');
    const data = await request.json();
    console.log('Database config update data:', data);
    
    return HttpResponse.json({
      message: "Database configuration updated successfully"
    });
  }),
  
  // Use a more flexible pattern for the test connection endpoint
  http.get('*/api/test-connection', () => {
    console.log('MSW: Intercepted GET to /api/test-connection with wildcard match');
    
    return HttpResponse.json({
      status: "Connected"
    });
  })
];

export default databaseHandlers;