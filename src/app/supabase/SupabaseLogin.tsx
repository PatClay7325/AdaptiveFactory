import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useSupabaseAuth } from '@auth/SupabaseAuthProvider';
import { useAppDispatch } from 'src/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';

const SupabaseLogin = () => {
  // Pre-fill with admin credentials for development
  const [email, setEmail] = useState<string>('admin@aimanufacturing.com');
  const [password, setPassword] = useState<string>('Otobale3');
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn } = useSupabaseAuth();
  const dispatch = useAppDispatch();

  const handleSignIn = async (e: React.FormEvent) => {
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

  // Function for dev auto-login button
  const handleDevLogin = () => {
    // Use the pre-filled credentials
    handleSignIn(new Event('submit') as any);
  };

  // Auto-login functionality
  useEffect(() => {
    // Uncomment the line below if you want auto-login on page load
    // handleDevLogin();
  }, []);

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
            <Box component="form" noValidate onSubmit={handleSignIn} sx={{ mt: 1 }}>
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
              
              {/* Quick dev login button */}
              <Button 
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handleDevLogin}
                sx={{ mb: 2 }}
              >
                Quick Dev Login
              </Button>
              
              {/* Test connection button */}
              <Button 
                fullWidth
                variant="outlined" 
                onClick={testConnection}
                sx={{ mb: 2 }}
              >
                Test Supabase Connection
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SupabaseLogin;