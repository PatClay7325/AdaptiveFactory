import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, Card, CardContent, LinearProgress, Alert } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

import { getSummaryData, getKeyMetrics } from '../../api/dashboard/summaryApi';
import { getAlerts } from '../../api/dashboard/alertsApi';
import { API_CONFIG } from '../../api/config'; // Add this import

function ExecutiveSummary() {
  const [summaryData, setSummaryData] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Log that we're starting to fetch data
        console.log('Fetching dashboard data...');
        
        // Fetch all data in parallel for better performance
        const [summaryResponse, metricsResponse, alertsResponse] = await Promise.all([
          getSummaryData(),
          getKeyMetrics('month'), // Using 'month' to match our mock data
          getAlerts('active')
        ]);
        
        console.log('Data received:', { summaryResponse, metricsResponse, alertsResponse });
        
        setSummaryData(summaryResponse);
        setMetrics(metricsResponse);
        setAlerts(alertsResponse);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-24 flex flex-col items-center justify-center">
        <Typography variant="h6" className="mb-16">Loading Dashboard Data...</Typography>
        <LinearProgress style={{ width: '50%' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-24">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="w-full p-24">
      <div className="flex items-center justify-between mb-24">
        <Typography variant="h4">Executive Summary</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Last updated: {summaryData?.last_updated ? new Date(summaryData.last_updated).toLocaleString() : 'N/A'}
        </Typography>
      </div>

      {/* Summary Overview */}
      <Paper style={{ padding: 16, marginBottom: 24 }} elevation={2}>
        <Typography variant="h6" style={{ marginBottom: 16 }}>Performance Overview</Typography>
        <Typography variant="body1">{summaryData?.overview_text || 'No overview available'}</Typography>
      </Paper>

      {/* Key Metrics */}
      <Typography variant="h5" style={{ marginBottom: 16, marginTop: 16 }}>Key Metrics</Typography>
      <Grid container spacing={2}>
        {metrics && metrics.map((metric, index) => (
          <Grid item xs={12} md={3} key={metric.id || index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{metric.name}</Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h4">{metric.value}</Typography>
                  <div 
                    style={{ 
                      marginLeft: 8,
                      display: 'flex',
                      alignItems: 'center',
                      color: metric.trend > 0 ? '#4caf50' : metric.trend < 0 ? '#f44336' : '#757575'
                    }}
                  >
                    {metric.trend > 0 ? (
                      <TrendingUpIcon fontSize="small" />
                    ) : metric.trend < 0 ? (
                      <TrendingDownIcon fontSize="small" />
                    ) : null}
                    <Typography 
                      variant="body2" 
                      style={{ 
                        color: metric.trend > 0 ? '#4caf50' : metric.trend < 0 ? '#f44336' : '#757575'
                      }}
                    >
                      {metric.trend > 0 ? '+' : ''}{metric.trend}%
                    </Typography>
                  </div>
                </div>
                <Typography variant="body2" color="text.secondary">
                  {metric.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <>
          <Typography variant="h5" style={{ marginTop: 24, marginBottom: 16 }}>Active Alerts</Typography>
          {alerts.map((alert, index) => (
            <Alert 
              key={alert.id}
              severity={alert.priority === 'high' ? 'error' : alert.priority === 'medium' ? 'warning' : 'info'}
              style={{ marginBottom: 8 }}
            >
              <Typography variant="subtitle2">{alert.message}</Typography>
              {alert.details && (
                <Typography variant="body2">{alert.details}</Typography>
              )}
            </Alert>
          ))}
        </>
      )}

      {/* Debug Info (remove in production) */}
      <Paper style={{ padding: 16, marginTop: 32, backgroundColor: '#f5f5f5' }}>
        <Typography variant="subtitle2">Debug Information:</Typography>
        <Typography variant="body2">Using MSW mock API</Typography>
        <Typography variant="body2">
          API Flag: {!API_CONFIG.USE_REAL_API ? 'Using Mock API' : 'Using Supabase API'}
        </Typography>
      </Paper>
    </div>
  );
}

export default ExecutiveSummary;