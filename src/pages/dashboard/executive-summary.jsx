import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { 
  Typography, 
  Grid, 
  Box, 
  Paper,
  Skeleton, 
  Alert,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Fade,
  Zoom
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Theme colors
const colors = [
  '#2E93fA', '#66DA26', '#546E7A', '#E91E63', 
  '#FF9800', '#FFC107', '#00E5FF', '#4CAF50'
];

/**
 * HighchartsComponent with functional drill-down simulation
 */
const HighchartsComponent = ({ options, containerProps, type = 'chart', onChartCreated }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Drill-down state management
  const [drilledState, setDrilledState] = useState({
    isDrilled: false,
    series: null,
    currentDrilldown: null
  });
  
  useEffect(() => {
    let isMounted = true;
    
    const loadHighcharts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load Highcharts:', err);
        if (isMounted) {
          setError('Failed to load chart library');
          setLoading(false);
        }
      }
    };

    loadHighcharts();
    
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && !error && chartRef.current) {
      if (onChartCreated) {
        onChartCreated({ chart: chartRef.current });
      }
    }
  }, [loading, error, onChartCreated]);

  const handleZoomIn = () => {
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setIsZoomed(false);
  };

  const handleExport = () => {
    alert('Chart data would be exported as CSV, Excel, or image');
  };
  
  // Handle drill-down
  const handleDrillDown = (itemName, itemIndex) => {
    // Find the appropriate drilldown series from options
    const drilldownId = options.series[0].data[itemIndex]?.drilldown;
    if (drilldownId && options.drilldown?.series) {
      const drilldownSeries = options.drilldown.series.find(s => s.id === drilldownId);
      if (drilldownSeries) {
        setDrilledState({
          isDrilled: true,
          series: drilldownSeries,
          currentDrilldown: drilldownId
        });
      }
    }
  };
  
  // Handle drill-up
  const handleDrillUp = () => {
    setDrilledState({
      isDrilled: false,
      series: null,
      currentDrilldown: null
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: containerProps?.style?.height || 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
        bgcolor: '#f5f5f5',
        borderRadius: 2
      }}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Loading advanced chart...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: containerProps?.style?.height || 400, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  // Determine current series data based on drill state
  const currentData = drilledState.isDrilled ? 
    drilledState.series.data : 
    options.series[0].data;
  
  const seriesName = drilledState.isDrilled ? 
    drilledState.series.name : 
    options.series[0].name;
  
  // Chart visualization with working drill-down
  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Chart controls */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          zIndex: 10,
          display: 'flex',
          gap: 1,
          bgcolor: 'rgba(255,255,255,0.8)',
          borderRadius: 1,
          p: 0.5
        }}
      >
        {drilledState.isDrilled && (
          <Tooltip title="Drill up">
            <IconButton 
              size="small" 
              onClick={handleDrillUp}
              sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' } }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        
        {(type === 'chart' || type === 'stock') && (
          <>
            <Tooltip title="Zoom in">
              <span> {/* Added span wrapper for disabled button */}
                <IconButton 
                  size="small" 
                  onClick={handleZoomIn}
                  disabled={isZoomed}
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' } }}
                >
                  <ZoomInIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Zoom out">
              <span> {/* Added span wrapper for disabled button */}
                <IconButton 
                  size="small" 
                  onClick={handleZoomOut}
                  disabled={!isZoomed}
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' } }}
                >
                  <ZoomOutIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </>
        )}
        <Tooltip title="Export chart">
          <IconButton 
            size="small" 
            onClick={handleExport}
            sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' } }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Placeholder visualization with working drill-down */}
      <Box 
        ref={chartRef}
        sx={{ 
          width: '100%', 
          height: containerProps?.style?.height || 400,
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          p: 3,
          bgcolor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 500 }}>
          {drilledState.isDrilled ? drilledState.series.name : options.title?.text}
          {drilledState.isDrilled && (
            <Button 
              startIcon={<ArrowBackIcon />} 
              size="small" 
              onClick={handleDrillUp}
              sx={{ ml: 2 }}
            >
              Back to main view
            </Button>
          )}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {drilledState.isDrilled 
            ? `Detailed breakdown for ${drilledState.series.name}` 
            : options.subtitle?.text}
        </Typography>
        
        <Box 
          sx={{ 
            width: '100%', 
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            minHeight: 200
          }}
        >
          {/* PIE CHART WITH DRILL-DOWN */}
          {options.chart?.type === 'pie' && (
            <Box sx={{ position: 'relative', width: 250, height: 250 }}>
              <Zoom in={!drilledState.isDrilled} style={{ transitionDelay: !drilledState.isDrilled ? '200ms' : '0ms' }}>
                <Box 
                  sx={{ 
                    width: 250,
                    height: 250,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderRadius: '50%',
                    background: 'conic-gradient(#2E93fA 0% 45%, #66DA26 45% 72%, #546E7A 72% 85%, #E91E63 85% 94%, #FF9800 94% 100%)',
                    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
                    display: drilledState.isDrilled ? 'none' : 'block'
                  }}
                />
              </Zoom>
              
              {/* Pie chart center hole */}
              {!drilledState.isDrilled && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    bgcolor: 'white',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>245 hrs</Typography>
                </Box>
              )}
              
              {/* Interactive pie segments */}
              {!drilledState.isDrilled && options.series[0].data.map((segment, index) => {
                // Calculate position around the circle
                const angle = (index / options.series[0].data.length) * 2 * Math.PI;
                const x = Math.cos(angle) * 110 + 125;
                const y = Math.sin(angle) * 110 + 125;
                
                return (
                  <Box
                    key={index}
                    onClick={() => handleDrillDown(segment.name, index)}
                    sx={{
                      position: 'absolute',
                      top: y - 20,
                      left: x - 20,
                      borderRadius: '50%',
                      bgcolor: 'white',
                      border: `2px solid ${colors[index % colors.length]}`,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        zIndex: 10
                      },
                      zIndex: 3
                    }}
                  >
                    <Tooltip 
                      title={
                        <Box sx={{ p: 1 }}>
                          <Typography variant="subtitle2">{segment.name}</Typography>
                          <Typography variant="body2">{segment.y}%</Typography>
                          <Typography variant="caption">Click to drill down</Typography>
                        </Box>
                      }
                    >
                      <ZoomInIcon />
                    </Tooltip>
                  </Box>
                );
              })}
              
              {/* Drilled down view */}
              {drilledState.isDrilled && (
                <Fade in={drilledState.isDrilled}>
                  <Box sx={{ width: '100%', height: '100%' }}>
                    <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
                      {drilledState.series.name} Breakdown
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      height: 'calc(100% - 40px)',
                      gap: 1
                    }}>
                      {drilledState.series.data.map((item, index) => (
                        <Box 
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: 'rgba(0,0,0,0.03)',
                            p: 1,
                            borderRadius: 1,
                            '&:hover': {
                              bgcolor: 'rgba(0,0,0,0.06)'
                            }
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: colors[index % colors.length],
                              mr: 1.5
                            }} 
                          />
                          <Typography flex={1}>{item[0]}</Typography>
                          <Typography fontWeight="bold">{item[1]}%</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Fade>
              )}
            </Box>
          )}
          
          {/* COLUMN CHART WITH DRILL-DOWN */}
          {options.chart?.type === 'column' && (
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              position: 'relative',
              p: 2
            }}>
              {/* Grid lines */}
              <Box sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pointerEvents: 'none',
                p: 2
              }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      width: '100%', 
                      height: '1px', 
                      bgcolor: '#ECEFF1'
                    }} 
                  />
                ))}
              </Box>
              
              {/* Columns */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-end',
                width: '100%',
                height: '100%',
                justifyContent: 'space-around',
                pt: 2, pb: 4
              }}>
                {!drilledState.isDrilled ? (
                  // Main view - product lines
                  options.series[0].data.map((item, index) => (
                    <Box 
                      key={index} 
                      onClick={() => handleDrillDown(item.name, index)}
                      sx={{ 
                        width: '18%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)'
                        }
                      }}
                    >
                      <Tooltip
                        title={
                          <Box sx={{ p: 1 }}>
                            <Typography variant="subtitle2">{item.name}</Typography>
                            <Typography variant="body2">{item.y}%</Typography>
                            <Typography variant="caption">Click to drill down</Typography>
                          </Box>
                        }
                      >
                        <Box sx={{ width: '100%', position: 'relative' }}>
                          <Box 
                            sx={{ 
                              height: `${(item.y-75)*4}px`, 
                              width: '100%', 
                              bgcolor: colors[index % colors.length],
                              borderRadius: '4px 4px 0 0',
                              position: 'relative',
                              '&:hover': {
                                bgcolor: colors[index % colors.length],
                                filter: 'brightness(1.1)',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            <Typography 
                              sx={{ 
                                position: 'absolute',
                                top: -25,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontWeight: 'bold'
                              }}
                            >
                              {item.y}%
                            </Typography>
                            
                            {/* Drill down indicator */}
                            <Box 
                              sx={{ 
                                position: 'absolute', 
                                top: '50%', 
                                left: '50%', 
                                transform: 'translate(-50%, -50%)',
                                bgcolor: 'rgba(255,255,255,0.8)',
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                '&:hover': { opacity: 1 }
                              }}
                            >
                              <ZoomInIcon fontSize="small" />
                            </Box>
                          </Box>
                          <Typography variant="caption" sx={{ mt: 1, textAlign: 'center', display: 'block' }}>
                            {item.name.replace('Product Line ', '')}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  ))
                ) : (
                  // Drilled down view
                  <Zoom in={drilledState.isDrilled} style={{ transitionDelay: '100ms' }}>
                    <Box sx={{ width: '100%', height: '100%' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {drilledState.series.name}
                        </Typography>
                        <Button 
                          startIcon={<ArrowBackIcon />} 
                          size="small" 
                          onClick={handleDrillUp}
                          variant="outlined"
                        >
                          Back
                        </Button>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-end',
                        width: '100%',
                        height: 'calc(100% - 40px)',
                        justifyContent: 'space-around'
                      }}>
                        {drilledState.series.data.map((item, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              width: '18%', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center'
                            }}
                          >
                            <Tooltip title={`${item[0]}: ${item[1]}%`}>
                              <Box 
                                sx={{ 
                                  height: `${(item[1]-75)*4}px`, 
                                  width: '100%', 
                                  bgcolor: colors[index % colors.length],
                                  borderRadius: '4px 4px 0 0',
                                  position: 'relative'
                                }}
                              >
                                <Typography 
                                  sx={{ 
                                    position: 'absolute',
                                    top: -25,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {item[1]}%
                                </Typography>
                              </Box>
                            </Tooltip>
                            <Typography variant="caption" sx={{ mt: 1, fontSize: '0.75rem' }}>
                              {item[0]}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Zoom>
                )}
              </Box>
            </Box>
          )}
          
          {/* LINE CHART */}
          {options.chart?.type === 'line' && (
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              position: 'relative',
              p: 2
            }}>
              {/* Grid lines */}
              <Box sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pointerEvents: 'none',
                p: 2
              }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      width: '100%', 
                      height: '1px', 
                      bgcolor: '#ECEFF1'
                    }} 
                  />
                ))}
              </Box>
              
              {/* X-axis */}
              <Box sx={{ 
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
                p: 2
              }}>
                {(options.xAxis?.categories || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']).slice(0, isZoomed ? 4 : 7).map((label, i) => (
                  <Typography key={i} variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                ))}
              </Box>
              
              {/* First series line */}
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, padding: 16 }}>
                <path 
                  d={isZoomed 
                    ? "M20,60 Q40,30 80,50 T140,30" 
                    : "M20,60 Q40,30 80,50 T140,30 T200,50 T260,20 T320,40 T380,10"}
                  fill="none"
                  stroke="#2E93fA"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Data points */}
                {isZoomed
                  ? [20, 80, 140].map((x, i) => (
                      <circle 
                        key={i} 
                        cx={x} 
                        cy={[60, 50, 30][i]}
                        r="5" 
                        fill="#2E93fA" 
                        stroke="white"
                        strokeWidth="2"
                      />
                    ))
                  : [20, 80, 140, 200, 260, 320, 380].map((x, i) => (
                      <circle 
                        key={i} 
                        cx={x} 
                        cy={[60, 50, 30, 50, 20, 40, 10][i]}
                        r="5" 
                        fill="#2E93fA" 
                        stroke="white"
                        strokeWidth="2"
                      />
                    ))
                }
              </svg>
              
              {/* Second series line if it exists */}
              {options.series && options.series.length > 1 && (
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, padding: 16 }}>
                  <path 
                    d={isZoomed 
                      ? "M20,70 Q40,40 80,60 T140,40" 
                      : "M20,70 Q40,40 80,60 T140,40 T200,60 T260,30 T320,50 T380,20"}
                    fill="none"
                    stroke="#66DA26"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="5,5"
                  />
                </svg>
              )}
              
              {/* Tooltip */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '30%',
                  left: '60%',
                  transform: 'translate(-50%, -100%)',
                  bgcolor: 'white',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                  borderRadius: 1,
                  p: 1,
                  zIndex: 10,
                  display: isZoomed ? 'block' : 'none',
                  width: 160
                }}
              >
                <Typography variant="caption" color="text.secondary">March 15, 2025</Typography>
                <Box sx={{ my: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 8, height: 8, bgcolor: '#2E93fA', mr: 1 }} />
                      <Typography variant="body2">Line 1:</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">1,300 units</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 8, height: 8, bgcolor: '#66DA26', mr: 1 }} />
                      <Typography variant="body2">Line 2:</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">1,150 units</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
          
          {/* Show drill-down indicators */}
          {options.drilldown && !drilledState.isDrilled && (
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: 10, 
                right: 10,
                bgcolor: 'rgba(25, 118, 210, 0.1)',
                color: '#1976D2',
                borderRadius: 5,
                px: 1,
                py: 0.5,
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <ZoomInIcon sx={{ fontSize: '0.875rem' }} />
              Click to drill down
            </Box>
          )}
        </Box>
        
        {/* Chart legend */}
        {options.series && options.series.length > 0 && !drilledState.isDrilled && (
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              mt: 2,
              flexWrap: 'wrap'
            }}
          >
            {options.series.map((series, i) => (
              <Box 
                key={i}
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Box 
                  sx={{ 
                    width: 12,
                    height: 12,
                    bgcolor: colors[i % colors.length],
                    borderRadius: series.type === 'line' ? 0 : '50%',
                    border: series.type === 'line' ? 'none' : '2px solid white',
                    boxShadow: series.type === 'line' ? 'none' : '0 0 2px rgba(0,0,0,0.3)'
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {series.name || `Series ${i+1}`}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

HighchartsComponent.propTypes = {
  options: PropTypes.object.isRequired,
  containerProps: PropTypes.object,
  type: PropTypes.oneOf(['chart', 'stock', 'map']),
  onChartCreated: PropTypes.func
};

/**
 * Manufacturing Dashboard with 4 Advanced Highcharts and working drill-down
 */
function AdvancedManufacturingDashboard({ title = "Manufacturing Analytics Dashboard" }) {
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(false);
  
  // Handle drill-down chart creation
  const handleQualityChartCreated = (chartInstance) => {
    console.log('Quality chart created, ready for drill-down', chartInstance);
  };
  
  // Production Trend Chart with Time Navigation - High-resolution time series
  const productionTrendOptions = {
    chart: {
      type: 'line',
      height: 400,
      zoomType: 'x',
      panning: true,
      panKey: 'shift'
    },
    time: {
      useUTC: false
    },
    title: {
      text: 'Production Trend'
    },
    subtitle: {
      text: 'Units produced per day with zoom and date navigation'
    },
    xAxistitle: {
      text: 'Production Trend'
    },
    subtitle: {
      text: 'Units produced per day with zoom and date navigation'
    },
    xAxis: {
      type: 'datetime',
      labels: {
        format: '{value:%b %d}'
      },
      crosshair: true,
      title: {
        text: 'Date'
      }
    },
    yAxis: [
      {
        title: {
          text: 'Units'
        },
        min: 0
      },
      {
        title: {
          text: 'Efficiency'
        },
        labels: {
          format: '{value}%'
        },
        opposite: true,
        max: 100
      }
    ],
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<table><tr><th colspan="2">{point.key:%A, %b %d, %Y}</th></tr>',
      pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
        '<td style="text-align: right"><b>{point.y}</b></td></tr>',
      footerFormat: '</table>',
      valueDecimals: 2
    },
    legend: {
      enabled: true
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 3
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3
          }
        },
        pointStart: Date.UTC(2025, 0, 1),
        pointInterval: 24 * 3600 * 1000 // one day
      }
    },
    annotations: [
      {
        labels: [
          {
            point: { x: Date.UTC(2025, 0, 15), y: 1200 },
            text: 'Equipment<br>Maintenance'
          }
        ],
        labelOptions: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderColor: '#BBDEFB',
          borderWidth: 1,
          borderRadius: 4,
          padding: 5,
          shadow: true
        }
      }
    ],
    series: [
      {
        name: 'Line 1 Production',
        data: [
          1200, 1250, 1220, 1300, 1350, 1280, 1320
        ],
        tooltip: {
          valueSuffix: ' units'
        }
      },
      {
        name: 'Line 2 Production',
        data: [
          980, 1000, 1050, 1080, 1100, 1150, 1170
        ],
        tooltip: {
          valueSuffix: ' units'
        }
      },
      {
        name: 'Overall Efficiency',
        type: 'spline',
        yAxis: 1,
        data: [
          85.2, 86.5, 85.8, 87.2, 88.1, 87.5, 88.4
        ],
        tooltip: {
          valueSuffix: '%'
        },
        color: '#FF9800',
        dashStyle: 'shortdot'
      }
    ]
  };

  // Quality Metrics Chart with Drill-down
  const qualityMetricsOptions = {
    chart: {
      type: 'column',
      height: 400,
      events: {
        drilldown: function(e) {
          console.log('Drilling down to', e.point.name);
        }
      }
    },
    title: {
      text: 'Quality Metrics by Product Line'
    },
    subtitle: {
      text: 'Click on columns to view detailed product data'
    },
    xAxis: {
      type: 'category',
      crosshair: true
    },
    yAxis: {
      min: 75,
      max: 100,
      title: {
        text: 'First Pass Yield (%)'
      },
      plotLines: [{
        value: 90,
        color: '#FF9800',
        dashStyle: 'shortdash',
        width: 2,
        label: {
          text: 'Target: 90%'
        }
      }]
    },
    legend: {
      enabled: false
    },
    tooltip: {
      useHTML: true,
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.1f}%</b> yield<br/>',
      footerFormat: '<small>Click for details</small>'
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        colorByPoint: true,
        borderRadius: 5,
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}%'
        }
      },
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: function() {
              // In a real implementation, this would trigger a drill-down
              console.log(`Drilling down to ${this.name} details`);
            }
          }
        }
      }
    },
    series: [{
      name: 'Product Lines',
      colorByPoint: true,
      data: [
        { name: 'Product Line A', y: 94.2, drilldown: 'A' },
        { name: 'Product Line B', y: 95.8, drilldown: 'B' },
        { name: 'Product Line C', y: 91.5, drilldown: 'C' },
        { name: 'Product Line D', y: 97.3, drilldown: 'D' },
        { name: 'Product Line E', y: 89.7, drilldown: 'E' }
      ]
    }],
    drilldown: {
      activeDataLabelStyle: {
        color: '#FFFFFF',
        textDecoration: 'none',
        textOutline: '1px #000000'
      },
      series: [
        {
          name: 'Product Line A Details',
          id: 'A',
          data: [
            ['A-100', 95.3],
            ['A-200', 93.8],
            ['A-300', 92.9],
            ['A-400', 96.2],
            ['A-500', 93.1]
          ]
        },
        {
          name: 'Product Line B Details',
          id: 'B',
          data: [
            ['B-100', 96.7],
            ['B-200', 97.2],
            ['B-300', 94.8],
            ['B-400', 95.3],
            ['B-500', 95.1]
          ]
        },
        {
          name: 'Product Line C Details',
          id: 'C',
          data: [
            ['C-100', 90.2],
            ['C-200', 92.5],
            ['C-300', 89.6],
            ['C-400', 94.1],
            ['C-500', 91.3]
          ]
        },
        {
          name: 'Product Line D Details',
          id: 'D',
          data: [
            ['D-100', 98.1],
            ['D-200', 96.8],
            ['D-300', 97.5],
            ['D-400', 97.1],
            ['D-500', 97.0]
          ]
        },
        {
          name: 'Product Line E Details',
          id: 'E',
          data: [
            ['E-100', 88.3],
            ['E-200', 90.1],
            ['E-300', 89.7],
            ['E-400', 91.2],
            ['E-500', 89.2]
          ]
        }
      ]
    }
  };

  // Downtime Analysis Chart with advanced tooltips and drill-down
  const downtimeAnalysisOptions = {
    chart: {
      type: 'pie',
      height: 400
    },
    title: {
      text: 'Downtime Analysis'
    },
    subtitle: {
      text: 'Click to explore root causes'
    },
    tooltip: {
      useHTML: true,
      pointFormat: '<div style="padding:10px;">' +
        '<h4 style="margin:0">{point.name}</h4>' +
        '<table>' +
        '<tr><td style="padding-right:10px">Total Hours:</td><td><b>{point.custom.hours} hrs</b></td></tr>' +
        '<tr><td style="padding-right:10px">Percentage:</td><td><b>{point.percentage:.1f}%</b></td></tr>' +
        '<tr><td style="padding-right:10px">Impact:</td><td>{point.custom.impact}</td></tr>' +
        '<tr><td style="padding-right:10px">Trend:</td><td>{point.custom.trend}</td></tr>' +
        '</table><hr/>' +
        '<small>Click to view detailed breakdown</small>' +
        '</div>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        innerSize: '60%',
        dataLabels: {
          enabled: true,
          format: '{point.name}<br>{point.percentage:.1f}%',
          distance: -30
        }
      }
    },
    series: [{
      name: 'Downtime',
      data: [
        {
          name: 'Equipment Failure',
          y: 45.0,
          custom: {
            hours: 110.3,
            impact: 'High',
            trend: 'Increasing ↑'
          },
          drilldown: 'equipment'
        },
        {
          name: 'Setup & Adjustment',
          y: 26.8,
          custom: {
            hours: 65.7,
            impact: 'Medium',
            trend: 'Stable →'
          },
          drilldown: 'setup'
        },
        {
          name: 'Minor Stops',
          y: 12.8,
          custom: {
            hours: 31.4,
            impact: 'Low',
            trend: 'Decreasing ↓'
          },
          drilldown: 'stops'
        },
        {
          name: 'Material Issues',
          y: 8.5,
          custom: {
            hours: 20.8,
            impact: 'Medium',
            trend: 'Stable →'
          },
          drilldown: 'material'
        },
        {
          name: 'Operator Unavailable',
          y: 6.9,
          custom: {
            hours: 16.9,
            impact: 'Low',
            trend: 'Decreasing ↓'
          },
          drilldown: 'operator'
        }
      ]
    }],
    drilldown: {
      series: [
        {
          name: 'Equipment Failure',
          id: 'equipment',
          data: [
            ['Mechanical', 45],
            ['Electrical', 32],
            ['Hydraulic', 15],
            ['Control System', 8]
          ]
        },
        {
          name: 'Setup & Adjustment',
          id: 'setup',
          data: [
            ['Tooling', 38],
            ['Calibration', 31],
            ['Product Changeover', 24],
            ['Software Configuration', 7]
          ]
        },
        {
          name: 'Minor Stops',
          id: 'stops',
          data: [
            ['Jams', 42],
            ['Sensor Triggers', 28],
            ['Component Feed', 21],
            ['Other', 9]
          ]
        },
        {
          name: 'Material Issues',
          id: 'material',
          data: [
            ['Quality', 51],
            ['Availability', 27],
            ['Incorrect Specs', 22]
          ]
        },
        {
          name: 'Operator Unavailable',
          id: 'operator',
          data: [
            ['Breaks', 38],
            ['Training', 34],
            ['Absence', 28]
          ]
        }
      ]
    }
  };

  // Energy Consumption Chart with forecasting
  const energyConsumptionOptions = {
    chart: {
      type: 'line',
      height: 400,
      zoomType: 'xy'
    },
    title: {
      text: 'Energy Consumption & Forecasting'
    },
    subtitle: {
      text: 'Actual vs. target with trend prediction'
    },
    xAxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
    },
    yAxis: {
      title: {
        text: 'Energy (kWh)'
      },
      min: 11000,
      plotLines: [{
        value: 12000,
        color: 'red',
        dashStyle: 'shortdash',
        width: 2,
        label: {
          text: 'Target'
        }
      }]
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<table><tr><th colspan="2">{point.key}</th></tr>',
      pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
        '<td style="text-align: right"><b>{point.y:,.0f} kWh</b></td></tr>',
      footerFormat: '</table>'
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
          radius: 3
        },
        lineWidth: 2
      }
    },
    series: [
      {
        name: 'Actual Consumption',
        data: [12500, 13100, 12900, 12800, 12600, 12700, 12400]
      },
      {
        name: 'Forecasted Consumption',
        dashStyle: 'shortdot',
        marker: {
          symbol: 'diamond'
        },
        data: [null, null, null, null, 12600, 12300, 12000]
      },
      {
        name: 'Target Consumption',
        dashStyle: 'shortdash',
        marker: {
          enabled: false
        },
        color: '#FF9800',
        enableMouseTracking: false,
        data: [12000, 12000, 12000, 12000, 12000, 12000, 12000]
      }
    ]
  };

  const handleDateRangeChange = (newRange) => {
    setLoading(true);
    // Simulate loading new data
    setTimeout(() => {
      setDateRange(newRange);
      setLoading(false);
    }, 800);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refreshing data
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Dashboard Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CalendarTodayIcon />}
            onClick={() => handleDateRangeChange(dateRange === 'month' ? 'quarter' : 'month')}
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            {dateRange === 'month' ? 'This Month' : 'This Quarter'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            color="primary"
            sx={{ borderRadius: 2 }}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </Box>
      </Box>
      
      {loading && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography sx={{ mt: 2 }}>Refreshing dashboard data...</Typography>
        </Box>
      )}
      
      {!loading && (
        <Grid container spacing={3}>
          {/* Production Trend Chart */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2, height: '100%', boxShadow: 3, borderRadius: 2 }}>
              <HighchartsComponent 
                options={productionTrendOptions} 
                containerProps={{ style: { height: 400 } }}
                type="stock"
              />
            </Paper>
          </Grid>
          
          {/* Quality Metrics Chart */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2, height: '100%', boxShadow: 3, borderRadius: 2 }}>
              <HighchartsComponent 
                options={qualityMetricsOptions} 
                containerProps={{ style: { height: 400 } }}
                onChartCreated={handleQualityChartCreated}
              />
            </Paper>
          </Grid>
          
          {/* Downtime Analysis Chart */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2, height: '100%', boxShadow: 3, borderRadius: 2 }}>
              <HighchartsComponent 
                options={downtimeAnalysisOptions} 
                containerProps={{ style: { height: 400 } }}
              />
            </Paper>
          </Grid>
          
          {/* Energy Consumption Chart */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2, height: '100%', boxShadow: 3, borderRadius: 2 }}>
              <HighchartsComponent 
                options={energyConsumptionOptions} 
                containerProps={{ style: { height: 400 } }}
                type="stock"
              />
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Instructions box */}
      <Paper 
        sx={{ 
          mt: 3, 
          p: 2, 
          bgcolor: '#e3f2fd', 
          border: '1px dashed #42a5f5',
          borderRadius: 2
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
          Interactive Drill-down Features:
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 0 }}>
          <Typography component="li">Click on any column in the "Quality Metrics" chart to see detailed product data</Typography>
          <Typography component="li">Click on pie segments in the "Downtime Analysis" chart to explore root causes</Typography>
          <Typography component="li">Use zoom controls to focus on specific time periods in the trend charts</Typography>
          <Typography component="li">Hover over data points to see detailed tooltips with additional information</Typography>
          <Typography component="li">Use the "Back" or "Drill up" buttons to return to the main chart view</Typography>
        </Box>
      </Paper>
    </Box>
  );
}

AdvancedManufacturingDashboard.propTypes = {
  title: PropTypes.string
};

export default AdvancedManufacturingDashboard;