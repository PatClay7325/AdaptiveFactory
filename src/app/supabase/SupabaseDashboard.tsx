import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@auth/SupabaseAuthProvider';
import { supabase } from 'src/configs/supabaseClient';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import type { Todo } from 'src/configs/supabaseClient';
import { useAppDispatch } from 'src/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`supabase-tabpanel-${index}`}
      aria-labelledby={`supabase-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `supabase-tab-${index}`,
    'aria-controls': `supabase-tabpanel-${index}`,
  };
}

const SupabaseDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user, isAdmin } = useSupabaseAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    website: '',
  });
  const [users, setUsers] = useState([]);
  const dispatch = useAppDispatch();

  // Fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false });
        
        // If not admin or not viewing all todos
        if (!isAdmin || tabValue !== 2) {
          query = query.eq('user_id', user?.id);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setTodos(data || []);
      } catch (error: any) {
        console.error('Error fetching todos:', error);
        dispatch(
          showMessage({
            message: 'Failed to fetch tasks',
            variant: 'error',
          })
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTodos();
    }
  }, [user, isAdmin, tabValue, dispatch]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          setProfileData({
            username: data.username || '',
            firstName: data.first_name || user.user_metadata?.firstName || '',
            lastName: data.last_name || user.user_metadata?.lastName || '',
            website: data.website || '',
          });
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch users if admin
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) throw error;
        
        setUsers(data || []);
      } catch (error: any) {
        console.error('Error fetching users:', error);
      }
    };

    if (tabValue === 3) {
      fetchUsers();
    }
  }, [isAdmin, tabValue]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodoText.trim() || !user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('todos')
        .insert([{ 
          task: newTodoText, 
          is_complete: false,
          user_id: user.id 
        }])
        .select();
      
      if (error) throw error;
      
      if (data) {
        setTodos([data[0], ...todos]);
        setNewTodoText('');
        dispatch(
          showMessage({
            message: 'Task created successfully',
            variant: 'success',
          })
        );
      }
    } catch (error: any) {
      console.error('Error creating todo:', error);
      dispatch(
        showMessage({
          message: 'Failed to create task',
          variant: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleTodoCompletion = async (id: number, is_complete: boolean) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update({ is_complete: !is_complete })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (data) {
        setTodos(todos.map(todo => todo.id === id ? data[0] : todo));
      }
    } catch (error: any) {
      console.error('Error updating todo:', error);
      dispatch(
        showMessage({
          message: 'Failed to update task',
          variant: 'error',
        })
      );
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTodos(todos.filter(todo => todo.id !== id));
      dispatch(
        showMessage({
          message: 'Task deleted successfully',
          variant: 'success',
        })
      );
    } catch (error: any) {
      console.error('Error deleting todo:', error);
      dispatch(
        showMessage({
          message: 'Failed to delete task',
          variant: 'error',
        })
      );
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Update auth metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
        }
      });
      
      if (metadataError) throw metadataError;
      
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: profileData.username,
          website: profileData.website,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          updated_at: new Date().toISOString(),
        });
      
      if (profileError) throw profileError;
      
      dispatch(
        showMessage({
          message: 'Profile updated successfully',
          variant: 'success',
        })
      );
    } catch (error: any) {
      console.error('Error updating profile:', error);
      dispatch(
        showMessage({
          message: 'Failed to update profile',
          variant: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Supabase Integration Dashboard
        </Typography>
        <Typography variant="subtitle1">
          {isAdmin ? 'Administrator Access' : 'User Access'} - {user?.email}
        </Typography>
      </Paper>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="supabase dashboard tabs">
            <Tab icon={<PersonIcon />} label="Profile" {...a11yProps(0)} />
            <Tab label="My Tasks" {...a11yProps(1)} />
            {isAdmin && <Tab label="All Tasks" {...a11yProps(2)} />}
            {isAdmin && <Tab icon={<AdminPanelSettingsIcon />} label="Admin Panel" {...a11yProps(3)} />}
          </Tabs>
        </Box>
        
        {/* Profile Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    User Profile
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={user?.email || ''}
                      disabled
                    />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        />
                      </Grid>
                    </Grid>
                    
                    <TextField
                      fullWidth
                      label="Username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    />
                    
                    <TextField
                      fullWidth
                      label="Website"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    />
                    
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={updateProfile}
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      Update Profile
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      User ID
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {user?.id}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Role
                    </Typography>
                    <Typography variant="body1">
                      {isAdmin ? 'Administrator' : 'User'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Auth Provider
                    </Typography>
                    <Typography variant="body1">
                      {user?.app_metadata?.provider || 'Email'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* My Tasks Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Tasks
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box component="form" onSubmit={createTodo} sx={{ display: 'flex', mb: 3 }}>
                <TextField
                  fullWidth
                  label="New Task"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  sx={{ mr: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !newTodoText.trim()}
                >
                  Add
                </Button>
              </Box>
              
              <List>
                {todos.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No tasks yet. Create one to get started!
                  </Typography>
                ) : (
                  todos.map((todo) => (
                    <ListItem key={todo.id} divider>
                      <ListItemIcon>
                        <Checkbox
                          checked={todo.is_complete}
                          onChange={() => toggleTodoCompletion(todo.id, todo.is_complete)}
                          edge="start"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={todo.task}
                        sx={{
                          textDecoration: todo.is_complete ? 'line-through' : 'none',
                          color: todo.is_complete ? 'text.secondary' : 'text.primary',
                        }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => deleteTodo(todo.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </TabPanel>
        
        {/* All Tasks Tab (Admin Only) */}
        {isAdmin && (
          <TabPanel value={tabValue} index={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  All User Tasks
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {todos.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No tasks found across all users.
                    </Typography>
                  ) : (
                    todos.map((todo) => (
                      <ListItem key={todo.id} divider>
                        <ListItemIcon>
                          <Checkbox
                            checked={todo.is_complete}
                            onChange={() => toggleTodoCompletion(todo.id, todo.is_complete)}
                            edge="start"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={todo.task}
                          secondary={`User ID: ${todo.user_id.slice(-6)}`}
                          sx={{
                            textDecoration: todo.is_complete ? 'line-through' : 'none',
                            color: todo.is_complete ? 'text.secondary' : 'text.primary',
                          }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => deleteTodo(todo.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>
          </TabPanel>
        )}
        
        {/* Admin Panel (Admin Only) */}
        {isAdmin && (
          <TabPanel value={tabValue} index={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Management
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {users.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No users found.
                    </Typography>
                  ) : (
                    users.map((user: any) => (
                      <ListItem key={user.id} divider>
                        <ListItemIcon>
                          {user.role === 'admin' ? <AdminPanelSettingsIcon color="warning" /> : <PersonIcon />}
                        </ListItemIcon>
                        <ListItemText
                          primary={`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Unnamed User'}
                          secondary={`User ID: ${user.id.slice(-6)} - Role: ${user.role || 'user'}`}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>
          </TabPanel>
        )}
      </Box>
    </Box>
  );
};

export default SupabaseDashboard;