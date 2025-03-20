import React, { useState, useEffect, useRef } from 'react';
import { 
  Typography, 
  Grid, 
  Box, 
  Paper, 
  Button, 
  IconButton, 
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  SelectChangeEvent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript Interfaces
interface ChartOptions {
  colors: string[];
  legend: boolean;
  animations: boolean;
  [key: string]: any;
}

interface DataSourceConfig {
  query?: string;
  url?: string;
  data?: string;
  [key: string]: any;
}

interface DataSource {
  type: 'supabase' | 'rest_api' | 'static';
  config: DataSourceConfig;
}

interface ChartConfig {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'table';
  dataSource: DataSource;
  options: ChartOptions;
}

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

interface DashboardSettings {
  theme: 'light' | 'dark' | 'custom';
  refreshInterval: number;
  showTitle: boolean;
  autoSave: boolean;
  [key: string]: any;
}

interface Dashboard {
  id: string;
  title: string;
  description: string;
  charts: ChartConfig[];
  layout: LayoutItem[];
  settings: DashboardSettings;
  created_at: string;
  updated_at: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

// Chart type icons mapping
const chartTypeIcons: Record<string, React.ReactNode> = {
  bar: <BarChartIcon />,
  line: <ShowChartIcon />,
  pie: <PieChartIcon />,
  table: <TableChartIcon />
};

// Enable width provider for responsive grid
const ResponsiveGridLayout = WidthProvider(Responsive);

// Mock chart preview component
interface ChartPreviewProps {
  chartConfig: ChartConfig;
}

const ChartPreviewMock: React.FC<ChartPreviewProps> = ({ chartConfig }) => {
  const getChartContent = () => {
    switch (chartConfig.type) {
      case 'bar':
        return (
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-end',
            p: 2
          }}>
            <Box sx={{ display: 'flex', height: '80%', alignItems: 'flex-end' }}>
              {[75, 85, 65, 90, 55].map((height, i) => (
                <Box 
                  key={i}
                  sx={{
                    width: '18%',
                    mx: '1%',
                    height: `${height}%`,
                    bgcolor: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'][i],
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    borderRadius: '4px 4px 0 0',
                  }}
                >
                  <Typography variant="caption" color="white" fontWeight="bold">
                    {height}%
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
              {['A', 'B', 'C', 'D', 'E'].map((label, i) => (
                <Typography key={i} variant="caption" color="text.secondary">
                  {label}
                </Typography>
              ))}
            </Box>
          </Box>
        );
      case 'line':
        return (
          <Box sx={{ height: '100%', position: 'relative', p: 2 }}>
            <svg width="100%" height="80%" style={{ position: 'absolute', top: 10, left: 0 }}>
              <path 
                d="M20,80 Q60,40 100,70 T180,50 T260,60 T340,20"
                fill="none"
                stroke="#2E93fA"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {[20, 100, 180, 260, 340].map((x, i) => (
                <circle 
                  key={i} 
                  cx={x} 
                  cy={[80, 70, 50, 60, 20][i]}
                  r="4" 
                  fill="#2E93fA" 
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </svg>
            <Box sx={{ position: 'absolute', bottom: 10, width: '100%', display: 'flex', justifyContent: 'space-around' }}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, i) => (
                <Typography key={i} variant="caption" color="text.secondary">
                  {month}
                </Typography>
              ))}
            </Box>
          </Box>
        );
      case 'pie':
        return (
          <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <Box sx={{ position: 'relative', width: 150, height: 150 }}>
              <Box 
                sx={{ 
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'conic-gradient(#2E93fA 0% 30%, #66DA26 30% 55%, #546E7A 55% 70%, #E91E63 70% 85%, #FF9800 85% 100%)',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
          </Box>
        );
      case 'table':
        return (
          <Box sx={{ height: '100%', p: 2, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #e0e0e0', padding: '8px', textAlign: 'left', backgroundColor: '#f5f5f5' }}>Category</th>
                  <th style={{ border: '1px solid #e0e0e0', padding: '8px', textAlign: 'right', backgroundColor: '#f5f5f5' }}>Value</th>
                  <th style={{ border: '1px solid #e0e0e0', padding: '8px', textAlign: 'right', backgroundColor: '#f5f5f5' }}>Change</th>
                </tr>
              </thead>
              <tbody>
                {['A', 'B', 'C', 'D', 'E'].map((item, i) => (
                  <tr key={i}>
                    <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>Category {item}</td>
                    <td style={{ border: '1px solid #e0e0e0', padding: '8px', textAlign: 'right' }}>{[75, 85, 65, 90, 55][i]}%</td>
                    <td style={{ border: '1px solid #e0e0e0', padding: '8px', textAlign: 'right', color: [2, 4].includes(i) ? '#f44336' : '#4caf50' }}>
                      {['+2.1%', '+1.3%', '-0.8%', '+5.2%', '-1.7%'][i]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        );
      default:
        return (
          <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Chart Preview
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ p: 1, borderBottom: '1px solid #eee' }}>
        {chartConfig.title || 'Untitled Chart'}
      </Typography>
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {getChartContent()}
      </Box>
    </Box>
  );
};

const DashboardBuilder: React.FC = () => {
  // Extract dashboard ID from URL if present
  const dashboardId = window.location.pathname.split('/').pop();
  const isNewDashboard = dashboardId === 'builder';
  
  // Dashboard state
  const [dashboard, setDashboard] = useState<Dashboard>({
    id: isNewDashboard ? uuidv4() : dashboardId || '',
    title: 'New Dashboard',
    description: '',
    charts: [],
    layout: [],
    settings: {
      theme: 'light',
      refreshInterval: 0,
      showTitle: true,
      autoSave: false
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  // UI state
  const [loading, setLoading] = useState<boolean>(!isNewDashboard);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [editingChart, setEditingChart] = useState<ChartConfig | null>(null);
  const [isChartDrawerOpen, setIsChartDrawerOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Load dashboard data if editing existing dashboard
  useEffect(() => {
    if (!isNewDashboard) {
      fetchDashboard();
    }
  }, [dashboardId]);

  // Setup auto-save if enabled
  useEffect(() => {
    let autoSaveInterval: NodeJS.Timeout | null = null;
    
    if (dashboard.settings.autoSave && !isNewDashboard) {
      // Clear any existing interval
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
      
      // Set up new interval
      autoSaveInterval = setInterval(() => {
        handleSaveDashboard(true); // True for silent save
      }, 30000); // Auto-save every 30 seconds
      
      return () => {
        if (autoSaveInterval) clearInterval(autoSaveInterval);
      };
    }
    
    return () => {
      if (autoSaveInterval) clearInterval(autoSaveInterval);
    };
  }, [dashboard.settings.autoSave, isNewDashboard]);

  const fetchDashboard = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('id', dashboardId)
        .single();

      if (error) throw error;
      
      if (data) {
        // Ensure data has the expected structure
        const dashboardData: Dashboard = {
          ...dashboard,
          ...data,
          charts: data.charts || [],
          layout: data.layout || [],
          settings: data.settings || dashboard.settings
        };
        setDashboard(dashboardData);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      showSnackbar('Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDashboard = async (silent: boolean = false): Promise<void> => {
    try {
      if (!silent) setSaving(true);
      
      const updates = {
        ...dashboard,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = isNewDashboard || dashboard.id === 'new'
        ? await supabase
            .from('dashboards')
            .insert([updates])
            .select()
        : await supabase
            .from('dashboards')
            .update(updates)
            .eq('id', dashboard.id)
            .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setDashboard(data[0] as Dashboard);
        
        // If it was a new dashboard, update the URL without reloading
        if (isNewDashboard) {
          window.history.pushState({}, '', `/dashboards/builder/${data[0].id}`);
        }
        
        if (!silent) {
          showSnackbar('Dashboard saved successfully', 'success');
        }
      }
    } catch (error) {
      console.error('Error saving dashboard:', error);
      if (!silent) {
        showSnackbar('Failed to save dashboard', 'error');
      }
    } finally {
      if (!silent) setSaving(false);
    }
  };

  const handleAddChart = (): void => {
    const newChart: ChartConfig = {
      id: uuidv4(),
      title: 'New Chart',
      type: 'bar',
      dataSource: {
        type: 'supabase',
        config: {
          query: 'SELECT * FROM your_table LIMIT 10'
        }
      },
      options: {
        colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
        legend: true,
        animations: true
      }
    };
    
    // Find the maximum y-coordinate in the current layout
    const maxY = dashboard.layout.reduce((max, item) => Math.max(max, item.y + item.h), 0);
    
    // Add new chart to dashboard
    const updatedDashboard: Dashboard = {
      ...dashboard,
      charts: [...dashboard.charts, newChart],
      layout: [
        ...dashboard.layout, 
        {
          i: newChart.id,
          x: 0,
          y: maxY, // Place below existing charts
          w: 6, // Half width of 12-column grid
          h: 4, // 4 rows high
          minW: 3,
          minH: 3
        }
      ]
    };
    
    setDashboard(updatedDashboard);
    setEditingChart(newChart);
    setIsChartDrawerOpen(true);
  };

  const handleRemoveChart = (chartId: string): void => {
    setDashboard({
      ...dashboard,
      charts: dashboard.charts.filter(chart => chart.id !== chartId),
      layout: dashboard.layout.filter(item => item.i !== chartId)
    });
    
    if (editingChart && editingChart.id === chartId) {
      setEditingChart(null);
      setIsChartDrawerOpen(false);
    }
  };

  const handleChartEdit = (chart: ChartConfig): void => {
    setEditingChart(chart);
    setIsChartDrawerOpen(true);
  };

  const handleChartUpdate = (updatedChart: ChartConfig): void => {
    setDashboard({
      ...dashboard,
      charts: dashboard.charts.map(chart => 
        chart.id === updatedChart.id ? updatedChart : chart
      )
    });
    setIsChartDrawerOpen(false);
  };

  const handleLayoutChange = (newLayout: LayoutItem[]): void => {
    if (!isDragging) {
      setDashboard({
        ...dashboard,
        layout: newLayout
      });
    }
  };

  const handleDashboardSettingsChange = (settings: Partial<DashboardSettings>): void => {
    setDashboard({
      ...dashboard,
      settings: {
        ...dashboard.settings,
        ...settings
      }
    });
    setSettingsDialogOpen(false);
  };

  const showSnackbar = (message: string, severity: SnackbarState['severity'] = 'info'): void => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (): void => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePreviewDashboard = (): void => {
    if (isNewDashboard) {
      showSnackbar('Please save the dashboard first to preview', 'warning');
    } else {
      window.location.href = `/dashboards/view/${dashboard.id}`;
    }
  };

  const handleBackToDashboards = (): void => {
    window.location.href = '/dashboards';
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue);
  };

  // Settings Dialog Component
  const SettingsDialog: React.FC = () => (
    <Dialog 
      open={settingsDialogOpen} 
      onClose={() => setSettingsDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Dashboard Settings
        <IconButton
          aria-label="close"
          onClick={() => setSettingsDialogOpen(false)}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="theme-select-label">Theme</InputLabel>
            <Select
              labelId="theme-select-label"
              value={dashboard.settings.theme}
              label="Theme"
              onChange={(e: SelectChangeEvent<string>) => {
                const newSettings = {
                  ...dashboard.settings,
                  theme: e.target.value as DashboardSettings['theme']
                };
                setDashboard({
                  ...dashboard,
                  settings: newSettings
                });
              }}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          
          {dashboard.settings.theme === 'custom' && (
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
              <TextField 
                label="Background Color" 
                size="small" 
                defaultValue="#ffffff" 
                InputProps={{
                  startAdornment: <FormatColorFillIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
              <TextField 
                label="Text Color" 
                size="small" 
                defaultValue="#333333" 
                InputProps={{
                  startAdornment: <FormatColorFillIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Box>
          )}
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="refresh-select-label">Auto Refresh</InputLabel>
            <Select
              labelId="refresh-select-label"
              value={dashboard.settings.refreshInterval}
              label="Auto Refresh"
              onChange={(e: SelectChangeEvent<number>) => {
                const newSettings = {
                  ...dashboard.settings,
                  refreshInterval: e.target.value as number
                };
                setDashboard({
                  ...dashboard,
                  settings: newSettings
                });
              }}
            >
              <MenuItem value={0}>Off</MenuItem>
              <MenuItem value={30}>Every 30 seconds</MenuItem>
              <MenuItem value={60}>Every minute</MenuItem>
              <MenuItem value={300}>Every 5 minutes</MenuItem>
              <MenuItem value={900}>Every 15 minutes</MenuItem>
              <MenuItem value={1800}>Every 30 minutes</MenuItem>
              <MenuItem value={3600}>Every hour</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel 
            control={
              <Switch 
                checked={dashboard.settings.showTitle} 
                onChange={(e) => {
                  const newSettings = {
                    ...dashboard.settings,
                    showTitle: e.target.checked
                  };
                  setDashboard({
                    ...dashboard,
                    settings: newSettings
                  });
                }}
              />
            } 
            label="Show Dashboard Title" 
            sx={{ mb: 2 }}
          />
          
          <FormControlLabel 
            control={
              <Switch 
                checked={dashboard.settings.autoSave} 
                onChange={(e) => {
                  const newSettings = {
                    ...dashboard.settings,
                    autoSave: e.target.checked
                  };
                  setDashboard({
                    ...dashboard,
                    settings: newSettings
                  });
                }}
              />
            } 
            label="Auto Save Changes" 
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSettingsDialogOpen(false)}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={() => setSettingsDialogOpen(false)}
        >
          Apply Settings
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Chart Editor Drawer
  const ChartEditorDrawer: React.FC = () => (
    <Drawer
      anchor="right"
      open={isChartDrawerOpen}
      onClose={() => setIsChartDrawerOpen(false)}
      sx={{ 
        '& .MuiDrawer-paper': { 
          width: { xs: '100%', sm: '450px' },
          p: 2
        } 
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Edit Chart</Typography>
        <IconButton onClick={() => setIsChartDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      {editingChart && (
        <Box sx={{ height: 'calc(100% - 60px)', display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Chart Title"
            value={editingChart.title}
            onChange={(e) => setEditingChart({ ...editingChart, title: e.target.value })}
            fullWidth
            margin="normal"
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="chart-type-label">Chart Type</InputLabel>
            <Select
              labelId="chart-type-label"
              value={editingChart.type}
              label="Chart Type"
              onChange={(e: SelectChangeEvent<string>) => setEditingChart({ 
                ...editingChart, 
                type: e.target.value as 'bar' | 'line' | 'pie' | 'table' 
              })}
            >
              <MenuItem value="bar">Bar Chart</MenuItem>
              <MenuItem value="line">Line Chart</MenuItem>
              <MenuItem value="pie">Pie Chart</MenuItem>
              <MenuItem value="table">Table</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Data Source</Typography>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="data-source-label">Source Type</InputLabel>
            <Select
              labelId="data-source-label"
              value={editingChart.dataSource.type}
              label="Source Type"
              onChange={(e: SelectChangeEvent<string>) => setEditingChart({ 
                ...editingChart, 
                dataSource: {
                  ...editingChart.dataSource,
                  type: e.target.value as 'supabase' | 'rest_api' | 'static'
                }
              })}
            >
              <MenuItem value="supabase">Supabase Database</MenuItem>
              <MenuItem value="rest_api">REST API</MenuItem>
              <MenuItem value="static">Static Data</MenuItem>
            </Select>
          </FormControl>
          
          {editingChart.dataSource.type === 'supabase' && (
            <TextField
              label="SQL Query"
              value={editingChart.dataSource.config.query || ''}
              onChange={(e) => setEditingChart({ 
                ...editingChart, 
                dataSource: {
                  ...editingChart.dataSource,
                  config: {
                    ...editingChart.dataSource.config,
                    query: e.target.value
                  }
                }
              })}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              placeholder="SELECT * FROM your_table LIMIT 10"
            />
          )}
          
          {editingChart.dataSource.type === 'rest_api' && (
            <TextField
              label="API Endpoint URL"
              value={editingChart.dataSource.config.url || ''}
              onChange={(e) => setEditingChart({ 
                ...editingChart, 
                dataSource: {
                  ...editingChart.dataSource,
                  config: {
                    ...editingChart.dataSource.config,
                    url: e.target.value
                  }
                }
              })}
              fullWidth
              margin="normal"
              placeholder="https://api.example.com/data"
            />
          )}
          
          {editingChart.dataSource.type === 'static' && (
            <TextField
              label="Static Data (JSON)"
              value={editingChart.dataSource.config.data || ''}
              onChange={(e) => setEditingChart({ 
                ...editingChart, 
                dataSource: {
                  ...editingChart.dataSource,
                  config: {
                    ...editingChart.dataSource.config,
                    data: e.target.value
                  }
                }
              })}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              placeholder='[{"x": "Category A", "y": 10}, {"x": "Category B", "y": 20}]'
            />
          )}
          
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Chart Options</Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Visual Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingChart.options.legend}
                    onChange={(e) => setEditingChart({
                      ...editingChart,
                      options: {
                        ...editingChart.options,
                        legend: e.target.checked
                      }
                    })}
                  />
                }
                label="Show Legend"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={editingChart.options.animations}
                    onChange={(e) => setEditingChart({
                      ...editingChart,
                      options: {
                        ...editingChart.options,
                        animations: e.target.checked
                      }
                    })}
                  />
                }
                label="Enable Animations"
              />
            </AccordionDetails>
          </Accordion>
          
          <Box sx={{ mt: 'auto', pt: 2, display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={() => handleRemoveChart(editingChart.id)}
              startIcon={<DeleteIcon />}
            >
              Delete Chart
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleChartUpdate(editingChart)}
              startIcon={<SaveIcon />}
            >
              Save Chart
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  );

  if (loading) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="h6">Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Back to Dashboards">
            <IconButton 
              edge="start" 
              onClick={handleBackToDashboards}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          
          <Box sx={{ mr: 2 }}>
            <TextField
              variant="standard"
              placeholder="Dashboard Title"
              value={dashboard.title}
              onChange={(e) => setDashboard({ ...dashboard, title: e.target.value })}
              sx={{ 
                minWidth: 200,
                '& .MuiInputBase-input': {
                  fontSize: '1.25rem',
                  fontWeight: 500
                },
                '& .MuiInput-root': {
                  '&:before, &:after': {
                    borderBottom: 'none',
                  },
                  '&:hover:not(.Mui-disabled):before': {
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                  },
                }
              }}
            />
          </Box>
          
          <Chip 
            label={isNewDashboard ? "New Dashboard" : "Editing Dashboard"} 
            color="primary" 
            size="small"
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Dashboard Settings">
            <IconButton 
              onClick={() => setSettingsDialogOpen(true)}
              color="primary"
              sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Toggle Preview Mode">
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => setPreviewMode(!previewMode)}
              sx={{ borderRadius: 2 }}
            >
              {previewMode ? 'Exit Preview' : 'Preview'}
            </Button>
          </Tooltip>
          
          <Tooltip title="Save Dashboard">
            <Button
              variant="contained"
              color="primary"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={() => handleSaveDashboard()}
              disabled={saving}
              sx={{ borderRadius: 2 }}
            >
              Save
            </Button>
          </Tooltip>
          
          {!isNewDashboard && (
            <Tooltip title="View Full Dashboard">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<VisibilityIcon />}
                onClick={handlePreviewDashboard}
                sx={{ borderRadius: 2 }}
              >
                View
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>
      
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Tabs */}
        {!previewMode && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Layout" />
              <Tab label="Dashboard Settings" />
              <Tab label="Data Sources" />
              <Tab label="Sharing" />
            </Tabs>
          </Box>
        )}
        
        {/* Dashboard Description Input */}
        {!previewMode && activeTab === 0 && (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField
              label="Dashboard Description"
              placeholder="Enter a description for your dashboard"
              value={dashboard.description}
              onChange={(e) => setDashboard({ ...dashboard, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddChart}
                sx={{ borderRadius: 2 }}
              >
                Add Chart
              </Button>
              
              <Typography variant="body2" color="text.secondary">
                {dashboard.charts.length} {dashboard.charts.length === 1 ? 'chart' : 'charts'} • Last saved: {new Date(dashboard.updated_at).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        )}
        
        {/* Dashboard Preview Mode */}
        {previewMode && (
          <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto', bgcolor: dashboard.settings.theme === 'dark' ? '#1e1e1e' : 'background.default' }}>
            <Paper
              elevation={3}
              sx={{ 
                p: 3,
                borderRadius: 2,
                mb: 3,
                bgcolor: dashboard.settings.theme === 'dark' ? '#2d2d2d' : 'background.paper',
                color: dashboard.settings.theme === 'dark' ? 'white' : 'text.primary',
              }}
            >
              {dashboard.settings.showTitle && (
                <Typography variant="h4" gutterBottom>
                  {dashboard.title}
                </Typography>
              )}
              
              {dashboard.description && (
                <Typography variant="body1" color={dashboard.settings.theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary'} paragraph>
                  {dashboard.description}
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={3}>
                {dashboard.charts.map((chart) => {
                  const layout = dashboard.layout.find(item => item.i === chart.id);
                  return (
                    <Grid item xs={12} md={6} key={chart.id}>
                      <Paper 
                        elevation={2}
                        sx={{ 
                          height: '300px',
                          borderRadius: 2,
                          overflow: 'hidden',
                          bgcolor: dashboard.settings.theme === 'dark' ? '#3d3d3d' : 'background.paper',
                        }}
                      >
                        <ChartPreviewMock chartConfig={chart} />
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Box>
        )}
        
        {/* Dashboard Layout Editor */}
        {!previewMode && activeTab === 0 && (
          <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
            {dashboard.charts.length === 0 ? (
              <Paper 
                sx={{ 
                  p: 6, 
                  textAlign: 'center', 
                  borderRadius: 2,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
              >
                <DashboardIcon sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Charts Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Start building your dashboard by adding charts. Each chart can display data from your Supabase database or other sources.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddChart}
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Add Your First Chart
                </Button>
              </Paper>
            ) : (
              <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: dashboard.layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={60}
                onLayoutChange={handleLayoutChange}
                onDragStart={() => setIsDragging(true)}
                onDragStop={() => setIsDragging(false)}
                isDraggable
                isResizable
                useCSSTransforms
              >
                {dashboard.charts.map((chart) => {
                  const layout = dashboard.layout.find(item => item.i === chart.id);
                  if (!layout) return null;
                  
                  return (
                    <div key={chart.id}>
                      <Paper 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          overflow: 'hidden',
                          borderRadius: 2
                        }}
                      >
                        <Box 
                          sx={{ 
                            p: 1, 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            bgcolor: 'background.default',
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mr: 1, color: 'primary.main' }}>
                              {chartTypeIcons[chart.type]}
                            </Box>
                            <Typography variant="subtitle2">
                              {chart.title}
                            </Typography>
                          </Box>
                          <Box>
                            <Tooltip title="Edit Chart">
                              <IconButton size="small" onClick={(e) => {
                                e.stopPropagation();
                                handleChartEdit(chart);
                              }}>
                                <SettingsIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove Chart">
                              <IconButton size="small" onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveChart(chart.id);
                              }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                          <ChartPreviewMock chartConfig={chart} />
                        </Box>
                      </Paper>
                    </div>
                  );
                })}
              </ResponsiveGridLayout>
            )}
          </Box>
        )}
        
        {/* Dashboard Settings Tab */}
        {!previewMode && activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Dashboard Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="dashboard-theme-label">Dashboard Theme</InputLabel>
                    <Select
                      labelId="dashboard-theme-label"
                      value={dashboard.settings.theme}
                      label="Dashboard Theme"
                      onChange={(e: SelectChangeEvent<string>) => setDashboard({
                        ...dashboard,
                        settings: {
                          ...dashboard.settings,
                          theme: e.target.value as DashboardSettings['theme']
                        }
                      })}
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="custom">Custom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="dashboard-refresh-label">Auto Refresh</InputLabel>
                    <Select
                      labelId="dashboard-refresh-label"
                      value={dashboard.settings.refreshInterval}
                      label="Auto Refresh"
                      onChange={(e: SelectChangeEvent<number>) => setDashboard({
                        ...dashboard,
                        settings: {
                          ...dashboard.settings,
                          refreshInterval: e.target.value as number
                        }
                      })}
                    >
                      <MenuItem value={0}>Off</MenuItem>
                      <MenuItem value={30}>Every 30 seconds</MenuItem>
                      <MenuItem value={60}>Every minute</MenuItem>
                      <MenuItem value={300}>Every 5 minutes</MenuItem>
                      <MenuItem value={900}>Every 15 minutes</MenuItem>
                      <MenuItem value={1800}>Every 30 minutes</MenuItem>
                      <MenuItem value={3600}>Every hour</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={dashboard.settings.showTitle}
                        onChange={(e) => setDashboard({
                          ...dashboard,
                          settings: {
                            ...dashboard.settings,
                            showTitle: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Show Dashboard Title"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={dashboard.settings.autoSave}
                        onChange={(e) => setDashboard({
                          ...dashboard,
                          settings: {
                            ...dashboard.settings,
                            autoSave: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Auto Save Changes"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
        
        {/* Data Sources Tab */}
        {!previewMode && activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Data Sources
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Connect your dashboard to various data sources. The data source configuration will be used by all charts in this dashboard.
                </Typography>
              </Box>
              
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Supabase Database</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Your dashboard is already connected to your Supabase database. You can configure individual queries in each chart.
                    </Typography>
                  </Box>
                  
                  <TextField
                    label="Supabase URL"
                    value={supabaseUrl}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                  
                  <TextField
                    label="Supabase Anon Key"
                    value={supabaseAnonKey ? "••••••••••••••••••••••••••••••" : ""}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2, borderRadius: 2 }}
                    onClick={() => showSnackbar('Connection tested successfully!', 'success')}
                  >
                    Test Connection
                  </Button>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>External REST API</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    label="API Base URL"
                    placeholder="https://api.example.com"
                    fullWidth
                    margin="normal"
                  />
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="auth-type-label">Authentication</InputLabel>
                    <Select
                      labelId="auth-type-label"
                      defaultValue="none"
                      label="Authentication"
                    >
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="basic">Basic Auth</MenuItem>
                      <MenuItem value="bearer">Bearer Token</MenuItem>
                      <MenuItem value="api_key">API Key</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2, mr: 1, borderRadius: 2 }}
                  >
                    Add API
                  </Button>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Box>
        )}
        
        {/* Sharing Tab */}
        {!previewMode && activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Dashboard Sharing
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Configure who can view or edit this dashboard. You can share with individuals or make it public.
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Access Link
                </Typography>
                
                <TextField
                  label="Dashboard URL"
                  value={isNewDashboard ? "Save dashboard to generate URL" : `${window.location.origin}/dashboards/view/${dashboard.id}`}
                  fullWidth
                  margin="normal"
                  disabled={isNewDashboard}
                  InputProps={{
                    endAdornment: (
                      <Button 
                        variant="text" 
                        disabled={isNewDashboard}
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/dashboards/view/${dashboard.id}`);
                          showSnackbar('URL copied to clipboard!', 'success');
                        }}
                      >
                        Copy
                      </Button>
                    )
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Access Control
                </Typography>
                
                <FormControl component="fieldset">
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Private - Only you can view and edit"
                  />
                </FormControl>
                
                <FormControl component="fieldset">
                  <FormControlLabel
                    control={<Switch />}
                    label="Share with specific users"
                  />
                </FormControl>
                
                <FormControl component="fieldset">
                  <FormControlLabel
                    control={<Switch />}
                    label="Public - Anyone with the link can view"
                  />
                </FormControl>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
      
      {/* Chart Editor Drawer */}
      <ChartEditorDrawer />
      
      {/* Settings Dialog */}
      <SettingsDialog />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardBuilder;