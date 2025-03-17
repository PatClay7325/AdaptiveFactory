import { useState, useEffect } from "react";
import { getDatabaseConfig, updateDatabaseConfig, testDatabaseConnection } from "../api/databaseConfig";

function SettingsPage() {
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

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Database Configuration</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSave} className="space-y-3">
        <input 
          name="host" 
          value={config.host} 
          onChange={handleChange} 
          placeholder="Host" 
          className="w-full p-2 border rounded" 
        />
        <input 
          name="port" 
          value={config.port} 
          onChange={handleChange} 
          placeholder="Port" 
          className="w-full p-2 border rounded" 
        />
        <input 
          name="user" 
          value={config.user} 
          onChange={handleChange} 
          placeholder="User" 
          autoComplete="username"
          className="w-full p-2 border rounded" 
        />
        <input 
          name="password" 
          type="password" 
          value={config.password} 
          onChange={handleChange} 
          placeholder="Password" 
          autoComplete="current-password"
          className="w-full p-2 border rounded" 
        />
        <input 
          name="dbname" 
          value={config.dbname} 
          onChange={handleChange} 
          placeholder="Database Name" 
          className="w-full p-2 border rounded" 
        />

        <div className="flex space-x-4 mt-4">
          <button 
            type="submit" 
            disabled={loading}
            className={`${loading ? 'bg-blue-300' : 'bg-blue-500'} text-white px-4 py-2 rounded`}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          <button 
            type="button" 
            onClick={handleTestConnection} 
            disabled={loading}
            className={`${loading ? 'bg-green-300' : 'bg-green-500'} text-white px-4 py-2 rounded`}
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        {connectionStatus && (
          <p className={`mt-3 ${connectionStatus === "Connected" ? "text-green-600" : "text-red-600"}`}>
            Connection Status: {connectionStatus}
          </p>
        )}
      </form>
    </div>
  );
}

export default SettingsPage;