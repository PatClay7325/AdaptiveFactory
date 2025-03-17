import React, { useEffect, useRef } from 'react';
import * as Dashboards from '@highcharts/dashboards';
import Highcharts from 'highcharts';
import AccessibilityModule from 'highcharts/modules/accessibility';
import DataGrid from '@highcharts/dashboards/datagrid';
import LayoutModule from '@highcharts/dashboards/modules/layout';

// ✅ Fix: Ensure Accessibility Module initializes correctly
if (typeof AccessibilityModule === 'function') {
    AccessibilityModule(Highcharts);
}

// ✅ Initialize Highcharts Plugins
Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);
Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);
LayoutModule(Dashboards);

// ✅ Set Highcharts global options
Highcharts.setOptions({
    accessibility: { enabled: false }
});

const CloudMonitoringDashboard = ({ title }) => {
    const dashboardRef = useRef(null);

    useEffect(() => {
        if (!dashboardRef.current) return;

        // ✅ FIXED: Added proper null check with optional chaining
        if (dashboardRef.current?.board) {
            dashboardRef.current.board.destroy();
        }

        // ✅ Create Highcharts Dashboards instance with a proper layout
        dashboardRef.current.board = Dashboards.board(dashboardRef.current, {
            gui: {
                layouts: [
                    {
                        id: 'dashboard-layout',
                        rows: [
                            {
                                cells: [{ id: 'cpu-chart' }] // ✅ Ensures 'cpu-chart' exists
                            }
                        ]
                    }
                ]
            },
            dataPool: {
                connectors: [
                    {
                        id: 'cpuData',
                        type: 'JSON',
                        options: {
                            data: [
                                ['Timestamp', 'CPU Usage'],
                                ['2025-03-17T08:00:00Z', 45],
                                ['2025-03-17T09:00:00Z', 55],
                                ['2025-03-17T10:00:00Z', 65]
                            ]
                        }
                    }
                ]
            },
            components: [
                {
                    cell: 'cpu-chart', // ✅ Matches the layout cell ID
                    type: 'Highcharts',
                    title: 'CPU Usage',
                    connector: { id: 'cpuData' },
                    chartOptions: {
                        chart: { type: 'spline' },
                        xAxis: { type: 'datetime' },
                        yAxis: { title: { text: 'CPU %' }, min: 0, max: 100 },
                        series: [{ name: 'CPU Usage', data: [] }]
                    }
                }
            ]
        });

        // ✅ FIXED: Improved cleanup function with proper null checking
        return () => {
            if (dashboardRef.current?.board) {
                dashboardRef.current.board.destroy();
            }
        };
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            {/* ✅ Ensure this div exists for Highcharts Dashboards */}
            <div ref={dashboardRef} className="mt-6 w-full min-h-[400px] bg-gray-100 p-4 rounded-md shadow-md"></div>
        </div>
    );
};

export default CloudMonitoringDashboard;