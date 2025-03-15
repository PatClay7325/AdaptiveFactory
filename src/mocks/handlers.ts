import { http, HttpResponse } from 'msw';

// Example handlers using MSW v2 syntax
export const handlers = [
  http.get('/api/example', () => {
    // Return a response directly without using the old res/ctx pattern
    return HttpResponse.json({ message: 'Example response' });
  }),
  
  http.post('/api/login', async ({ request }) => {
    // Parse the request body and add type assertion for TypeScript
    const data = await request.json() as { email: string; password: string };
    const { email, password } = data;
    
    // Example login logic
    if (email === 'admin@example.com' && password === 'password') {
      return HttpResponse.json({ 
        success: true, 
        user: { email, name: 'Admin User' }, 
        token: 'mock-jwt-token' 
      });
    }
    
    return HttpResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  })
];