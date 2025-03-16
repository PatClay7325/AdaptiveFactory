import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from 'src/configs/supabaseClient';
import type { User, Session } from 'src/configs/supabaseClient';
import { useDispatch } from 'react-redux';
// Import your auth actions - adjust the path as needed
// import { setUser, userLoggedOut } from 'src/store/userSlice';

// Define the auth context
type SupabaseAuthContextType = {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string, metadata?: object) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  session: null,
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  loading: true,
});

export const useSupabaseAuth = () => useContext(SupabaseAuthContext);

type SupabaseAuthProviderProps = {
  children: React.ReactNode;
};

export const SupabaseAuthProvider: React.FC<SupabaseAuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setIsAdmin(session?.user?.user_metadata?.role === 'admin');
      setLoading(false);

      // If you want to update Redux store
      // if (session) {
      //   dispatch(setUser({
      //     uuid: session.user.id,
      //     role: session.user.user_metadata?.role || 'user',
      //     data: {
      //       displayName: `${session.user.user_metadata?.firstName || ''} ${session.user.user_metadata?.lastName || ''}`.trim(),
      //       email: session.user.email,
      //     }
      //   }));
      // }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setIsAdmin(session?.user?.user_metadata?.role === 'admin');
      
      // If you want to update Redux store
      // if (session) {
      //   dispatch(setUser({
      //     uuid: session.user.id,
      //     role: session.user.user_metadata?.role || 'user',
      //     data: {
      //       displayName: `${session.user.user_metadata?.firstName || ''} ${session.user.user_metadata?.lastName || ''}`.trim(),
      //       email: session.user.email,
      //     }
      //   }));
      // } else {
      //   dispatch(userLoggedOut());
      // }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return {
      error,
      data: data?.session || null,
    };
  };

  const signUp = async (email: string, password: string, metadata: object = {}) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName: '',
          lastName: '',
          role: 'user',
          ...metadata
        }
      }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    isAuthenticated: !!session,
    isAdmin,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export default SupabaseAuthProvider;