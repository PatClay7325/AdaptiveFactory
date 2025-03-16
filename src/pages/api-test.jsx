import React, { useState } from 'react';
import { 
  Typography, 
  Paper, 
  Button, 
  LinearProgress, 
  Divider, 
  List, 
  ListItem, 
  ListItemText 
} from '@mui/material';

import { getSummaryData, getKeyMetrics } from '../api/dashboard/summaryApi';
import { getAlerts, markAlertAsRead } from '../api/dashboard/alertsApi';

function ApiTest() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const runTest = async (name, fn, ...args) => {
    try {
      setLoading(true);
      console.log(`Testing ${name}...`);
      const startTime = Date.now();
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      
      setResults(prev => [
        ...prev,
        { 
          name, 
          success: true, 
          data: result, 
          duration,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      
      console.log(`Test ${name} succeeded:`, result);
      return result;
    } catch (error) {
      console.error(`Test ${name} failed:`, error);
      
      setResults(prev => [
        ...prev,
        { 
          name, 
          success: false, 
          error: error.message || String(error), 
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const runAllTests = async () => {
    setResults([]);
    
    await runTest('getSummaryData', getSummaryData);
    await runTest('getKeyMetrics', getKeyMetrics, 'month');
    await runTest('getAlerts', getAlerts, 'active');
    
    // Test alert marking if we have alerts
    const alerts = await runTest('getAlerts for markAlertAsRead', getAlerts, 'active');
    if (alerts && alerts.length > 0) {
      await runTest('markAlertAsRead', markAlertAsRead, alerts[0].id);
    }
  };
  
  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h4" style={{ marginBottom: 24 }}>API Testing Tool</Typography>
      
      <Paper style={{ padding: 16, marginBottom: 24 }}>
        <Typography variant="h6" style={{ marginBottom: 16 }}>Test API Functions</Typography>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={runAllTests}
            disabled={loading}
          >
            Run All Tests
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => runTest('getSummaryData', getSummaryData)}
            disabled={loading}
          >
            Test getSummaryData()
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => runTest('getKeyMetrics', getKeyMetrics, 'month')}
            disabled={loading}
          >
            Test getKeyMetrics()
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => runTest('getAlerts', getAlerts, 'active')}
            disabled={loading}
          >
            Test getAlerts()
          </Button>
        </div>
        
        {loading && <LinearProgress style={{ marginBottom: 16 }} />}
        
        <Typography variant="subtitle1" style={{ marginBottom: 8 }}>Test Results:</Typography>
        
        {results.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No tests run yet.</Typography>
        ) : (
          <List>
            {results.map((result, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: result.success ? 'green' : 'red' }}>
                          {result.success ? '✅' : '❌'}
                        </span>
                        <Typography variant="subtitle1" style={{ marginLeft: 8 }}>
                          {result.name}
                        </Typography>
                        {result.duration && (
                          <Typography variant="caption" style={{ marginLeft: 8 }}>
                            ({result.duration}ms)
                          </Typography>
                        )}
                        <Typography variant="caption" style={{ marginLeft: 'auto' }}>
                          {result.timestamp}
                        </Typography>
                      </div>
                    }
                    secondary={
                      <div style={{ marginTop: 8 }}>
                        {result.success ? (
                          <pre style={{ 
                            backgroundColor: '#f5f5f5',
                            padding: 8,
                            borderRadius: 4,
                            maxHeight: 200,
                            overflow: 'auto'
                          }}>
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        ) : (
                          <Typography color="error">{result.error}</Typography>
                        )}
                      </div>
                    }
                  />
                </ListItem>
                {index < results.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </div>
  );
}

export default ApiTest;