import React, { useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button, 
  Divider, 
  Link,
  LinearProgress,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Enhanced Under Development Page Component
 * 
 * Following industry SOP with visual improvements and clear information
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.version - Version information (optional)
 * @param {Date} props.estimatedCompletion - Estimated completion date (optional)
 * @param {string} props.contactEmail - Contact email for inquiries (optional)
 * @param {string} props.docsUrl - URL to documentation (optional)
 * @param {string} props.pageId - Unique identifier for analytics (optional)
 */
const UnderDevelopmentPage = ({ 
  title = 'Page Under Development',
  version = 'v0.1.0',
  estimatedCompletion,
  contactEmail = 'support@adaptivefactory.ai',
  docsUrl = '/documentation',
  pageId
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Analytics tracking
  useEffect(() => {
    if (pageId) {
      // Example analytics call
      console.log(`Tracking page visit: ${pageId} - ${title}`);
      // In production, you would use your analytics service here
      // Example: trackPageView(pageId, 'under-development', title);
    }
  }, [pageId, title]);

  // Calculate estimated days to completion
  const daysToCompletion = estimatedCompletion 
    ? Math.max(0, Math.ceil((new Date(estimatedCompletion) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Paper 
        elevation={3}
        sx={{ 
          p: { xs: 2, sm: 4 }, 
          borderRadius: 2,
          background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
          border: '1px solid #e0e0e0'
        }}
      >
        {/* Version tag and timestamp */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Chip 
            size="small" 
            label={`${version} • ${new Date().toLocaleDateString()}`}
            color="primary"
            variant="outlined"
            icon={<InfoIcon fontSize="small" />}
          />
        </Box>
        
        {/* Header with title and description */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              color: '#1a1a1a'
            }}
          >
            <ConstructionIcon fontSize="large" />
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, maxWidth: '600px', mx: 'auto' }}>
            We're working hard to build this feature. Thank you for your patience!
          </Typography>
          
          {/* Progress indicator */}
          <Box sx={{ mt: 2, mb: 1, maxWidth: '600px', mx: 'auto' }}>
            <LinearProgress 
              variant="indeterminate" 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'rgba(0,0,0,0.08)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#333'
                }
              }} 
            />
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Detailed information */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon />
              Development Status
            </Typography>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(0,0,0,0.02)', 
              borderRadius: 2,
              border: '1px dashed rgba(0,0,0,0.1)',
              mb: 3
            }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Typography variant="body1" fontWeight="medium">In Development</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Priority:</Typography>
                  <Typography variant="body1" fontWeight="medium">Medium</Typography>
                </Grid>
                {daysToCompletion !== null && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Estimated Release:</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {estimatedCompletion.toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Timeline:</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        ~{daysToCompletion} days remaining
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MenuBookIcon />
              Available Alternatives
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" paragraph>
                While this page is under development, you might find these resources helpful:
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <Link href={docsUrl}>View our documentation</Link> for related features and APIs
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Check our <Link href="/dashboard">dashboard</Link> for an overview of available functionality
                </Typography>
                <Typography component="li" variant="body2">
                  <Link href="/api-test">API Testing page</Link> for direct interaction with available endpoints
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                bgcolor: 'rgba(0,0,0,0.02)', 
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon />
                Need More Information?
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 3 }}>
                If you need immediate assistance or have questions about this feature, our support team is here to help.
              </Typography>
              
              <Box sx={{ mt: 'auto' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  href={`mailto:${contactEmail}?subject=Inquiry about: ${title}`}
                  sx={{ 
                    mb: 2,
                    bgcolor: '#333',
                    '&:hover': {
                      bgcolor: '#000'
                    }
                  }}
                >
                  Contact Support
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<ArrowBackIcon />} 
                  fullWidth
                  href="/dashboard"
                  sx={{ 
                    color: '#333',
                    borderColor: '#333',
                    '&:hover': {
                      borderColor: '#000',
                      bgcolor: 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  Return to Dashboard
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Footer with version and system info */}
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Adaptive Factory AI Solutions • {version} • Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default UnderDevelopmentPage;