import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  LinearProgress, 
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import { 
  DatePicker,
  LocalizationProvider 
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse, addDays } from 'date-fns';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

import { useDataFetching } from '../../hooks/useDataFetching';
import { 
  getResources, 
  getResourceAllocation, 
  getJobs, 
  allocateResource, 
  updateResourceAllocation 
} from '../../api';

function ResourceAllocation() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allocateDialog, setAllocateDialog] = useState(false);
  const [allocationData, setAllocationData] = useState({
    resource_id: '',
    job_id: '',
    hours: 1,
    notes: ''
  });
  
  // Format the date for API calls
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  // Load resources, jobs, and current allocations
  const { data: resources, loading: resourcesLoading } = 
    useDataFetching(getResources, []);
  
  const { data: jobs, loading: jobsLoading } = 
    useDataFetching(() => getJobs('pending', 'in_progress'), []);
  
  const { data: allocations, loading: allocationsLoading, refetch: refetchAllocations } = 
    useDataFetching(() => getResourceAllocation(formattedDate), [formattedDate]);
  
  const loading = resourcesLoading || jobsLoading || allocationsLoading;
  
  // Group allocations by resource
  const getAllocationsByResource = (resourceId) => {
    if (!allocations) return [];
    return allocations.filter(allocation => allocation.resource_id === resourceId);
  };
  
  // Calculate total allocated hours per resource
  const getTotalHours = (resourceId) => {
    const resourceAllocations = getAllocationsByResource(resourceId);
    return resourceAllocations.reduce((total, allocation) => total + allocation.hours, 0);
  };
  
  const handleOpenAllocateDialog = (resourceId = '') => {
    setAllocationData({
      resource_id: resourceId,
      job_id: '',
      hours: 1,
      notes: ''
    });
    setAllocateDialog(true);
  };
  
  const handleCloseDialog = () => {
    setAllocateDialog(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAllocationData({
      ...allocationData,
      [name]: value
    });
  };
  
  const handleAllocate = async () => {
    try {
      await allocateResource({
        ...allocationData,
        date: formattedDate
      });
      handleCloseDialog();
      refetchAllocations();
    } catch (error) {
      console.error('Error allocating resource:', error);
    }
  };
  
  const handleDeleteAllocation = async (allocationId) => {
    if (window.confirm('Are you sure you want to delete this allocation?')) {
      try {
        // Set hours to 0 to effectively delete the allocation
        await updateResourceAllocation(allocationId, { hours: 0 });
        refetchAllocations();
      } catch (error) {
        console.error('Error deleting allocation:', error);
      }
    }
  };
  
  const getResourceById = (resourceId) => {
    return resources?.find(resource => resource.id === resourceId) || null;
  };
  
  const getJobById = (jobId) => {
    return jobs?.find(job => job.id === jobId) || null;
  };

  if (loading) {
    return (
      <div className="w-full p-24 flex justify-center">
        <LinearProgress className="w-xs" />
      </div>
    );
  }

  return (
    <div className="w-full p-24">
      <div className="flex justify-between items-center mb-24">
        <Typography variant="h4">Resource Allocation</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>

      <Grid container spacing={3}>
        {resources && resources.map((resource) => (
          <Grid item xs={12} key={resource.id}>
            <Card>
              <CardContent>
                <div className="flex justify-between items-center mb-16">
                  <Typography variant="h6">{resource.name}</Typography>
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenAllocateDialog(resource.id)}
                    >
                      Allocate
                    </Button>
                  </div>
                </div>
                
                <Paper variant="outlined" className="mb-16 p-8">
                  <Typography variant="subtitle2">
                    Type: {resource.type}
                  </Typography>
                  <Typography variant="subtitle2">
                    Status: {resource.status}
                  </Typography>
                  <Typography variant="subtitle2">
                    Allocated Hours: {getTotalHours(resource.id)} / 24
                  </Typography>
                </Paper>
                
                {getAllocationsByResource(resource.id).length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Job</TableCell>
                          <TableCell>Hours</TableCell>
                          <TableCell>Notes</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getAllocationsByResource(resource.id).map((allocation) => (
                          <TableRow key={allocation.id}>
                            <TableCell>{getJobById(allocation.job_id)?.name || 'Unknown Job'}</TableCell>
                            <TableCell>{allocation.hours}</TableCell>
                            <TableCell>{allocation.notes}</TableCell>
                            <TableCell>
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteAllocation(allocation.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="textSecondary" className="text-center p-16">
                    No allocations for this resource on the selected date
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Resource Allocation Dialog */}
      <Dialog open={allocateDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Allocate Resource</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" className="mb-16 mt-8">
            <InputLabel>Resource</InputLabel>
            <Select
              name="resource_id"
              value={allocationData.resource_id}
              onChange={handleInputChange}
              label="Resource"
            >
              {resources && resources.map((resource) => (
                <MenuItem key={resource.id} value={resource.id}>
                  {resource.name} ({resource.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth variant="outlined" className="mb-16">
            <InputLabel>Job</InputLabel>
            <Select
              name="job_id"
              value={allocationData.job_id}
              onChange={handleInputChange}
              label="Job"
            >
              {jobs && jobs.map((job) => (
                <MenuItem key={job.id} value={job.id}>
                  {job.name} ({job.status})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            name="hours"
            label="Hours"
            type="number"
            value={allocationData.hours}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            className="mb-16"
            inputProps={{ min: 0.5, max: 24, step: 0.5 }}
          />
          
          <TextField
            name="notes"
            label="Notes"
            value={allocationData.notes}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAllocate} color="primary">Allocate</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ResourceAllocation;