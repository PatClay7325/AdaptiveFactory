-- Create a table for public profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  website TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a policy that allows users to view all profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

-- Create a policy that allows users to insert their own profile
CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a policy that allows users to update only their own profile
CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Setup RLS for the table
ALTER TABLE profiles FORCE ROW LEVEL SECURITY;

-- This trigger automatically creates a profile entry when a new user signs up
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    username, 
    avatar_url, 
    website, 
    first_name, 
    last_name, 
    role,
    updated_at
  )
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', new.email), 
    new.raw_user_meta_data->>'avatar_url', 
    '', 
    new.raw_user_meta_data->>'firstName',
    new.raw_user_meta_data->>'lastName',
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    NOW()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This trigger automatically creates a profile entry when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();