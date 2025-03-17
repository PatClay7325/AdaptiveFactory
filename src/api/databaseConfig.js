const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Fetch the current database connection settings
export const getDatabaseConfig = async () => {
  try {
    console.log('Fetching database config from:', `${API_URL}/api/config`);
    const response = await fetch(`${API_URL}/api/config`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Database config fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch database config:', error);
    // Return fallback data if the API call fails
    console.log('Using fallback database config');
    return {
      DATABASE_URL: "postgresql://postgres:password@localhost:5432/my_local_db"
    };
  }
};

// Update database connection settings
export const updateDatabaseConfig = async (config) => {
  try {
    console.log('Updating database config:', config);
    
    // Convert config object to DATABASE_URL format if it's not already
    let requestBody = config;
    if (!config.DATABASE_URL) {
      const dbUrl = `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.dbname}`;
      requestBody = { DATABASE_URL: dbUrl };
    }
    
    const response = await fetch(`${API_URL}/api/config`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Database config updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update database config:', error);
    return { message: "Failed to update database configuration" };
  }
};

// Test the database connection
export const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection');
    const response = await fetch(`${API_URL}/api/test-connection`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Database connection test result:', data);
    return data;
  } catch (error) {
    console.error('Failed to test database connection:', error);
    return { status: "Connection failed" };
  }
};