import { useState, useEffect } from "react";
import { getDatabaseConfig, updateDatabaseConfig, testDatabaseConnection } from "../api/databaseConfig";

// Tab components
const ConnectionTab = ({ 
  config, setConfig, 
  connectionStatus, setConnectionStatus, 
  loading, setLoading, 
  error, setError, 
  handleChange, handleSave, handleTestConnection 
}) => {
  const [databaseStats, setDatabaseStats] = useState(null);
  
  useEffect(() => {
    if (connectionStatus === "Connected") {
      // Load database stats only when connected
      setDatabaseStats({
        size: "256 MB",
        tables: 42,
        activeConnections: 5,
        uptime: "24 days, 3 hours",
        lastBackup: "2025-03-16 08:00:00"
      });
    }
  }, [connectionStatus]);
  
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-4">
        <h3 className="text-lg font-medium text-blue-800">Connection Management</h3>
        <p className="text-sm text-blue-600">Configure your database connection settings for the application.</p>
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-1">Host</label>
            <input 
              id="host"
              name="host" 
              value={config.host} 
              onChange={handleChange} 
              placeholder="Host" 
              className="w-full p-2 border rounded" 
            />
          </div>
          <div>
            <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-1">Port</label>
            <input 
              id="port"
              name="port" 
              value={config.port} 
              onChange={handleChange} 
              placeholder="Port" 
              className="w-full p-2 border rounded" 
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input 
            id="user"
            name="user" 
            value={config.user} 
            onChange={handleChange} 
            placeholder="User" 
            autoComplete="username"
            className="w-full p-2 border rounded" 
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            id="password"
            name="password" 
            type="password" 
            value={config.password} 
            onChange={handleChange} 
            placeholder="Password" 
            autoComplete="current-password"
            className="w-full p-2 border rounded" 
          />
        </div>
        
        <div>
          <label htmlFor="dbname" className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
          <input 
            id="dbname"
            name="dbname" 
            value={config.dbname} 
            onChange={handleChange} 
            placeholder="Database Name" 
            className="w-full p-2 border rounded" 
          />
        </div>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4">
          <button 
            type="submit" 
            disabled={loading}
            className={`${loading ? 'bg-blue-300' : 'bg-blue-500'} text-white px-6 py-2 rounded flex items-center justify-center`}
          >
            {loading ? 
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </> : 
              'Save Settings'
            }
          </button>
          
          <button 
            type="button" 
            onClick={handleTestConnection} 
            disabled={loading}
            className={`${loading ? 'bg-green-300' : 'bg-green-500'} text-white px-6 py-2 rounded flex items-center justify-center`}
          >
            {loading ? 
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Testing...
              </> : 
              'Test Connection'
            }
          </button>
          
          <button 
            type="button"
            onClick={() => {
              const connectionString = `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.dbname}`;
              navigator.clipboard.writeText(connectionString);
              alert("Connection string copied to clipboard");
            }}
            className="bg-gray-500 text-white px-6 py-2 rounded flex items-center justify-center"
          >
            Copy Connection String
          </button>
        </div>
      </form>

      {connectionStatus && (
        <div className={`p-4 mt-4 rounded ${connectionStatus === "Connected" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${connectionStatus === "Connected" ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="font-medium">Connection Status:</span> 
            <span className="ml-2">{connectionStatus}</span>
          </div>
        </div>
      )}
      
      {databaseStats && connectionStatus === "Connected" && (
        <div className="mt-6 bg-gray-50 p-4 rounded border">
          <h3 className="text-md font-medium mb-3">Database Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-500">Database Size</div>
              <div className="text-lg font-medium">{databaseStats.size}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-500">Tables</div>
              <div className="text-lg font-medium">{databaseStats.tables}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-500">Active Connections</div>
              <div className="text-lg font-medium">{databaseStats.activeConnections}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-500">Uptime</div>
              <div className="text-lg font-medium">{databaseStats.uptime}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-500">Last Backup</div>
              <div className="text-lg font-medium">{databaseStats.lastBackup}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ApiEndpointsTab = () => {
  const [apiCategories, setApiCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load API endpoints categorized by navigation sections
    setTimeout(() => {
      setApiCategories([
        {
          name: "Dashboard",
          endpoints: [
            { path: "/api/dashboard/summary", method: "GET", description: "Get executive dashboard summary data" },
            { path: "/api/dashboard/cloud-monitoring", method: "GET", description: "Get cloud resource monitoring data" },
            { path: "/api/dashboard/ai-insights", method: "GET", description: "Get AI-generated business insights" },
            { path: "/api/dashboard/alerts", method: "GET", description: "Get system alerts and notifications" },
            { path: "/api/dashboard/custom", method: "GET", description: "Get custom dashboard configurations" },
            { path: "/api/dashboard/custom", method: "POST", description: "Save custom dashboard configuration" },
            { path: "/api/dashboard/views", method: "GET", description: "Get saved dashboard views" },
            { path: "/api/dashboard/shared", method: "GET", description: "Get shared dashboards" }
          ]
        },
        {
          name: "User Management",
          endpoints: [
            { path: "/api/users", method: "GET", description: "Get all users" },
            { path: "/api/users", method: "POST", description: "Create new user" },
            { path: "/api/users/{id}", method: "GET", description: "Get user details" },
            { path: "/api/users/{id}", method: "PUT", description: "Update user" },
            { path: "/api/users/{id}", method: "DELETE", description: "Delete user" },
            { path: "/api/roles", method: "GET", description: "Get all roles and permissions" },
            { path: "/api/roles", method: "POST", description: "Create new role" },
            { path: "/api/tenants", method: "GET", description: "Get all tenants" },
            { path: "/api/access-control", method: "GET", description: "Get access control rules" }
          ]
        },
        {
          name: "Security & Compliance",
          endpoints: [
            { path: "/api/security/audit-logs", method: "GET", description: "Get system audit logs" },
            { path: "/api/security/incidents", method: "GET", description: "Get security incidents" },
            { path: "/api/security/iso-compliance", method: "GET", description: "Get ISO compliance status" }
          ]
        },
        {
          name: "System Configuration",
          endpoints: [
            { path: "/api/config", method: "GET", description: "Get database configuration" },
            { path: "/api/config", method: "POST", description: "Update database configuration" },
            { path: "/api/test-connection", method: "GET", description: "Test database connection" },
            { path: "/api/settings/general", method: "GET", description: "Get general settings" },
            { path: "/api/settings/notifications", method: "GET", description: "Get notification settings" },
            { path: "/api/settings/backup", method: "GET", description: "Get backup configuration" },
            { path: "/api/settings/updates", method: "GET", description: "Check for system updates" }
          ]
        },
        {
          name: "Operations",
          endpoints: [
            { path: "/api/operations/planning", method: "GET", description: "Get production planning data" },
            { path: "/api/operations/scheduling", method: "GET", description: "Get scheduling information" },
            { path: "/api/operations/resources", method: "GET", description: "Get resource allocation data" },
            { path: "/api/operations/materials", method: "GET", description: "Get material planning data" },
            { path: "/api/operations/jobs", method: "GET", description: "Get job tracking information" },
            { path: "/api/operations/status", method: "GET", description: "Get real-time production status" },
            { path: "/api/operations/performance", method: "GET", description: "Get performance metrics" },
            { path: "/api/operations/history", method: "GET", description: "Get historical operations data" },
            { path: "/api/operations/instructions", method: "GET", description: "Get work instructions" },
            { path: "/api/operations/workflows", method: "GET", description: "Get workflow automation details" }
          ]
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);
  
  const toggleCategory = (index) => {
    if (expandedCategory === index) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(index);
    }
  };
  
  const handleTestEndpoint = (endpoint) => {
    alert(`Testing endpoint: ${endpoint.method} ${endpoint.path}`);
  };
  
  // Add these new handler functions for the export/download buttons
  const handleExportOpenAPI = () => {
    // Generate OpenAPI spec JSON
    const openApiSpec = {
      openapi: "3.0.0",
      info: {
        title: "Application API",
        version: "1.0.0",
        description: "API documentation for the application"
      },
      paths: {}
    };
    
    // Add each endpoint to the spec
    apiCategories.forEach(category => {
      category.endpoints.forEach(endpoint => {
        if (!openApiSpec.paths[endpoint.path]) {
          openApiSpec.paths[endpoint.path] = {};
        }
        
        openApiSpec.paths[endpoint.path][endpoint.method.toLowerCase()] = {
          summary: endpoint.description,
          responses: {
            "200": {
              description: "Successful operation"
            }
          }
        };
      });
    });
    
    // Convert to JSON and create download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(openApiSpec, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "openapi-spec.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  const handleDownloadDocs = () => {
    // Generate markdown documentation
    let markdown = "# API Documentation\n\n";
    
    apiCategories.forEach(category => {
      markdown += `## ${category.name}\n\n`;
      
      category.endpoints.forEach(endpoint => {
        markdown += `### ${endpoint.method} ${endpoint.path}\n\n`;
        markdown += `${endpoint.description}\n\n`;
        markdown += "**Parameters:** None\n\n";
        markdown += "**Response:** JSON\n\n";
        markdown += "---\n\n";
      });
    });
    
    // Create download
    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(markdown);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "api-documentation.md");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 p-4 rounded border border-indigo-200 mb-4">
        <h3 className="text-lg font-medium text-indigo-800">API Endpoints</h3>
        <p className="text-sm text-indigo-600">Complete list of API endpoints required for frontend integration.</p>
        <p className="mt-1 text-sm text-indigo-600">This documentation is intended for backend developers implementing the API layer.</p>
      </div>
      
      <div className="flex space-x-4 mb-4">
        <button 
          className="bg-indigo-500 text-white px-4 py-2 rounded"
          onClick={handleExportOpenAPI}
        >
          Export OpenAPI Spec
        </button>
        <button 
          className="bg-indigo-500 text-white px-4 py-2 rounded"
          onClick={handleDownloadDocs}
        >
          Download API Documentation
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">API Endpoint Categories</h3>
            <span className="text-sm text-gray-500">Total: {apiCategories.reduce((acc, cat) => acc + cat.endpoints.length, 0)} endpoints</span>
          </div>
          
          {apiCategories.map((category, index) => (
            <div key={index} className="border rounded overflow-hidden">
              <div 
                className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                onClick={() => toggleCategory(index)}
              >
                <h4 className="font-medium">{category.name}</h4>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">{category.endpoints.length} endpoints</span>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transform ${expandedCategory === index ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {expandedCategory === index && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {category.endpoints.map((endpoint, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' : 
                              endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                              endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {endpoint.method}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{endpoint.path}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{endpoint.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleTestEndpoint(endpoint)} 
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Test
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
          
          <div className="mt-6 bg-yellow-50 p-4 rounded border border-yellow-200">
            <h3 className="text-md font-medium text-yellow-800 mb-2">Implementation Notes for Backend Developers</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-700">
              <li>All endpoints should return a consistent response format (data, status, message)</li>
              <li>Authentication is required for all endpoints (JWT tokens)</li>
              <li>Implement proper error handling with appropriate HTTP status codes</li>
              <li>Include CORS headers to allow requests from the frontend domain</li>
              <li>Implement rate limiting for security</li>
              <li>Document any additional endpoints needed for specific features</li>
              <li>The API category list is not exhaustive - see the navigation config for more routes</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Tab Navigation component
const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-6 flex border-b">
      <button 
        className={`py-2 px-4 font-medium ${activeTab === "connection" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
        onClick={() => setActiveTab("connection")}
      >
        Connection
      </button>
      <button 
        className={`py-2 px-4 font-medium ${activeTab === "api" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-500"}`}
        onClick={() => setActiveTab("api")}
      >
        API Endpoints
      </button>
    </div>
  );
};

// Main SettingsPage component
function SettingsPage() {
  // ===== STATE MANAGEMENT =====
  const [activeTab, setActiveTab] = useState("connection");
  const [config, setConfig] = useState({
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "",
    dbname: "my_local_db",
  });
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== DATA LOADING =====
  useEffect(() => {
    // Load current settings from backend
    setLoading(true);
    getDatabaseConfig()
      .then((data) => {
        try {
          const urlParts = data.DATABASE_URL.replace("postgresql://", "").split("@");
          const credentials = urlParts[0].split(":");
          const hostParts = urlParts[1].split("/");

          setConfig({
            user: credentials[0],
            password: credentials[1],
            host: hostParts[0].split(":")[0],
            port: hostParts[0].split(":")[1],
            dbname: hostParts[1],
          });
        } catch (error) {
          console.error("Error parsing database URL:", error);
          setError("Failed to parse database configuration");
        }
      })
      .catch((error) => {
        console.error("Error fetching database config:", error);
        setError("Failed to load database configuration");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ===== EVENT HANDLERS =====
  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateDatabaseConfig(config);
      alert(result.message);
    } catch (error) {
      console.error("Error saving config:", error);
      setError("Failed to save configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setConnectionStatus(null);
    setError(null);
    
    try {
      const result = await testDatabaseConnection();
      setConnectionStatus(result.status);
    } catch (error) {
      console.error("Error testing connection:", error);
      setConnectionStatus("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== MAIN RENDER =====
  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Database Management</h2>
      
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "connection" && (
        <ConnectionTab 
          config={config}
          setConfig={setConfig}
          connectionStatus={connectionStatus}
          setConnectionStatus={setConnectionStatus}
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
          handleChange={handleChange}
          handleSave={handleSave}
          handleTestConnection={handleTestConnection}
        />
      )}
      {activeTab === "api" && <ApiEndpointsTab />}
    </div>
  );
}

export default SettingsPage;