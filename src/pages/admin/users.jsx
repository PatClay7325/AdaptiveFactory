import React, { useState } from 'react';
import { 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

import { useDataFetching } from '../../hooks/useDataFetching';
import { getUsers, getRoles, createUser, updateUser, deleteUser } from '../../api';

function Users() {
  const { data: users, loading: usersLoading, error: usersError, refetch: refetchUsers } = 
    useDataFetching(getUsers, []);
  
  const { data: roles, loading: rolesLoading } = 
    useDataFetching(getRoles, []);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role_id: '',
    status: 'active'
  });

  const handleOpenDialog = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        role_id: user.role_id || '',
        status: user.status || 'active'
      });
    } else {
      setCurrentUser(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        role_id: '',
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      if (currentUser) {
        await updateUser(currentUser.id, formData);
      } else {
        await createUser(formData);
      }
      handleCloseDialog();
      refetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        refetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (usersLoading || rolesLoading) {
    return (
      <div className="w-full p-24 flex justify-center">
        <LinearProgress className="w-xs" />
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="w-full p-24">
        <Typography color="error">{usersError}</Typography>
      </div>
    );
  }

  return (
    <div className="w-full p-24">
      <div className="flex justify-between items-center mb-24">
        <Typography variant="h4">User Management</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roles?.name || 'No role assigned'}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{currentUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="first_name"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.first_name}
            onChange={handleInputChange}
            className="mb-16"
          />
          <TextField
            margin="dense"
            name="last_name"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.last_name}
            onChange={handleInputChange}
            className="mb-16"
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            className="mb-16"
          />
          <FormControl fullWidth variant="outlined" className="mb-16">
            <InputLabel>Role</InputLabel>
            <Select
              name="role_id"
              value={formData.role_id}
              onChange={handleInputChange}
              label="Role"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {roles && roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Users;