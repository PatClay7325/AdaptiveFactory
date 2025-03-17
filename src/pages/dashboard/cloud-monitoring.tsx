import React from 'react';
import CloudMonitoringDashboard from './CloudMonitoringDashboard';

/**
 * Cloud Monitoring Page
 * Displays the cloud infrastructure monitoring dashboard.
 */
function CloudMonitoringPage() {
  return (
    <div className="flex flex-col p-24 sm:p-32">
      <div className="text-4xl font-extrabold tracking-tight">Cloud Infrastructure Monitoring</div>
      <div className="flex-auto py-32">
        <CloudMonitoringDashboard title="Cloud Infrastructure Overview" />
      </div>
    </div>
  );
}

export default CloudMonitoringPage;
