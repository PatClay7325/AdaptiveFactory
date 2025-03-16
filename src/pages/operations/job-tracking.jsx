import React, { useState } from 'react';
import { 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  LinearProgress, 
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import { useDataFetching } from '../../hooks/useDataFetching';
import { getJobs, updateJobStatus, trackJobProgress } from '../../api';

function JobTracking() {
  const { data: jobs, loading, error, refetch: refetchJobs } = 
    useDataFetching(() => getJobs(null), []);
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [statusData, setStatusData] = useState({
    status: '',
    notes: ''
  });

  const handleOpenUpdateDialog = (job) => {
    setSelectedJob(job);
    setStatusData({
      status: job.status,
      notes: ''
    });
    setUpdateDialog(true);
  };

  const handleCloseDialog = () => {
    setUpdateDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStatusData({
      ...statusData,
      [name]: value
    });
  };

  const handleUpdateStatus = async () => {
    try {
      await updateJobStatus(selectedJob.id, statusData.status, { notes: statusData.notes });
      
      // Also track this progress update
      await trackJobProgress(selectedJob.id, {
        status: statusData.status,
        notes: statusData.notes,
        progress: statusData.status === 'completed' ? 100 : undefined
      });
      
      handleCloseDialog();
      refetchJobs();
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'in_progress':
        return 'primary';
      case 'on_hold':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="w-full p-24 flex justify-center">
        <LinearProgress className="w-xs" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-24">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="w-full p-24">
      <Typography variant="h4" className="mb-24">Job Tracking</Typography>

      <Paper className="mb-32 p-16">
        <Typography variant="h6" className="mb-16">Job Status Overview</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Pending</Typography>
                <Typography variant="h4">
                  {jobs ? jobs.filter(job => job.status === 'pending').length : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">In Progress</Typography>
                <Typography variant="h4">
                  {jobs ? jobs.filter(job => job.status === 'in_progress').length : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">On Hold</Typography>
                <Typography variant="h4">
                  {jobs ? jobs.filter(job => job.status === 'on_hold').length : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Completed</Typography>
                <Typography variant="h4">
                  {jobs ? jobs.filter(job => job.status === 'completed').length : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job Name</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Estimated Start</TableCell>
              <TableCell>Estimated End</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs && jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.name}</TableCell>
                <TableCell>{job.priority}</TableCell>
                <TableCell>
                  <Chip 
                    label={job.status} 
                    color={getStatusColor(job.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {job.estimated_start ? new Date(job.estimated_start).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  {job.estimated_end ? new Date(job.estimated_end).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => handleOpenUpdateDialog(job)}
                  >
                    Update Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Status Dialog */}
      <Dialog open={updateDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Update Job Status</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" className="mb-16">
            Job: {selectedJob?.name}
          </Typography>
          
          <FormControl fullWidth variant="outlined" className="mb-16">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={statusData.status}
              onChange={handleInputChange}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="on_hold">On Hold</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            name="notes"
            label="Status Notes"
            multiline
            rows={4}
            value={statusData.notes}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateStatus} color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default JobTracking;