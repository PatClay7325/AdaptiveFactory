// src/app/supabase/SupabaseLogin.tsx
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// Remove history import
import { useSupabaseAuth } from '@auth/SupabaseAuthProvider';
import { useAppDispatch } from 'src/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';

const SupabaseLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useSupabaseAuth();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { error } = await signIn(email, password);
      
      if (error) throw error;
      
      dispatch(
        showMessage({
          message: 'Sign in successful',
          variant: 'success',
        })
      );
      
      // Simple redirect instead of history push
      window.location.href = '/supabase/dashboard';
    } catch (error: any) {
      dispatch(
        showMessage({
          message: error.message || 'An error occurred during sign in',
          variant: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  // Add a test connection button
  const testConnection = async () => {
    try {
      dispatch(
        showMessage({
          message: 'Testing Supabase connection...',
          variant: 'info',
        })
      );
      
      const { supabase } = await import('src/configs/supabaseClient');
      const { data, error } = await supabase.from('profiles').select('count');
      
      if (error) throw error;
      
      dispatch(
        showMessage({
          message: `Connection successful! Found profiles table.`,
          variant: 'success',
        })
      );
      console.log('Connection test success:', data);
    } catch (err) {
      console.error('Connection test failed:', err);
      dispatch(
        showMessage({
          message: `Connection error: ${err.message}`,
          variant: 'error',
        })
      );
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Grid container spacing={4} sx={{ height: '100vh' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?manufacturing)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
              AI Manufacturing
            </Typography>
            <Typography component="h2" variant="h5">
              Sign in with Supabase
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              
              {/* Add test connection button */}
              <Button 
                fullWidth
                variant="outlined" 
                onClick={testConnection}
                sx={{ mt: 2, mb: 2 }}
              >
                Test Supabase Connection
              </Button>
              
              <Grid container>
                <Grid item xs>
                  {/* Use button instead of link */}
                  <Button
                    sx={{ textTransform: 'none', p: 0 }}
                    onClick={() => window.location.href = '/forgot-password'}
                  >
                    Forgot password?
                  </Button>
                </Grid>
                <Grid item>
                  {/* Use button instead of link */}
                  <Button
                    sx={{ textTransform: 'none', p: 0 }}
                    onClick={() => window.location.href = '/supabase/register'}
                  >
                    Don't have an account? Sign Up
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SupabaseLogin;