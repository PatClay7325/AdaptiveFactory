import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for user metadata
export type UserMetadata = {
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'user';
  email_verified?: boolean;
  phone_verified?: boolean;
  sub?: string;
};

// Types for auth user
export type User = {
  id: string;
  email?: string;
  user_metadata?: UserMetadata;
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
};

// Types for profiles
export type Profile = {
  id: string;
  username: string | null;
  website: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  first_name?: string | null;
  last_name?: string | null;
  role?: string | null;
};

// Types for todos
export type Todo = {
  id: number;
  user_id: string;
  task: string;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
};

// Auth session type
export type Session = {
  user: User;
  access_token: string;
  refresh_token: string;
};