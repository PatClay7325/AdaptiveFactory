import React from 'react';
import { DashboardConfig } from '../../../../types/dashboard-types';

interface DashboardControlsProps {
  dashboardConfig: DashboardConfig;
  onSave: () => void;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({ 
  dashboardConfig, 
  onSave 
}) => {
  return (
    <div className="dashboard-controls flex justify-between items-center mb-6 p-3 bg-gray-100 rounded">
      <div className="dashboard-info">
        <h2 className="text-lg font-medium">{dashboardConfig.title}</h2>
      </div>
      
      <div className="controls-buttons flex gap-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onSave}
        >
          Save Dashboard
        </button>
      </div>
    </div>
  );
};

export default DashboardControls;