import { useEffect, useState } from 'react';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { useAppDispatch } from 'src/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import SupabaseAuthProvider from '@auth/SupabaseAuthProvider';
import Authentication from '@auth/Authentication';

/**
 * This component combines your existing Authentication system with Supabase.
 * It wraps your existing Authentication in a SupabaseAuthProvider.
 */
function AuthenticationWithSupabase(props) {
  const { children } = props;
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // You can add initialization code for Supabase here
    setIsLoading(false);
    
    dispatch(
      showMessage({
        message: 'Supabase authentication initialized',
        variant: 'success',
      })
    );
  }, [dispatch]);

  if (isLoading) {
    return <FuseSplashScreen />;
  }

  return (
    <SupabaseAuthProvider>
      <Authentication>{children}</Authentication>
    </SupabaseAuthProvider>
  );
}

export default AuthenticationWithSupabase;