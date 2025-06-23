/*
  # Create User and User Profile Tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - References auth.users
      - `email` (text, unique)
      - `role` (enum) - User role
      - `profile` (uuid) - Reference to user_profiles
      - `is_active` (boolean) - Account status
      - `status` (enum) - User status
      - `password_otp` (integer) - OTP for password reset
      - `last_login` (timestamptz) - Last login time
      - `created_at` (timestamptz)
      - `modified_at` (timestamptz)
      - `version` (integer) - For optimistic locking

    - `user_profiles`
      - `_id` (uuid, primary key) - Main identifier
      - `email` (text)
      - `name` (text) - Full name
      - `dob` (date) - Date of birth
      - `projects` (jsonb) - Project data
      - `image` (text) - Profile image URL
      - `image_thumb` (text) - Thumbnail image URL
      - `created_at` (timestamptz)
      - `modified_at` (timestamptz)
      - `id` (serial) - Auto-increment ID

  2. Security
    - Enable RLS on both tables
    - Add policies for user access control
*/

-- Create enums
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

-- Update existing user_role enum to include new roles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer', 'vendor', 'user');
    END IF;
END $$;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  _id uuid PRIMARY KEY,
  email text NOT NULL,
  name text NOT NULL,
  dob date,
  projects jsonb DEFAULT '{}',
  image text,
  image_thumb text,
  created_at timestamptz DEFAULT now(),
  modified_at timestamptz DEFAULT now(),
  id serial UNIQUE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'user',
  profile uuid REFERENCES user_profiles(_id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  status user_status DEFAULT 'active',
  password_otp integer,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  modified_at timestamptz DEFAULT now(),
  version integer DEFAULT 1
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_profile ON users(profile);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_name ON user_profiles(name);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read own user record"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own user record"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for user_profiles table
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = _id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = _id);

CREATE POLICY "Users can read other profiles (limited)"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update modified_at timestamp
CREATE OR REPLACE FUNCTION update_modified_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.modified_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_modified_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_at_column();

CREATE TRIGGER update_user_profiles_modified_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user_registration()
RETURNS trigger AS $$
DECLARE
  profile_id uuid;
BEGIN
  -- Generate a new UUID for the profile
  profile_id := gen_random_uuid();
  
  -- Create user profile first
  INSERT INTO user_profiles (_id, email, name)
  VALUES (
    profile_id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  
  -- Create user record
  INSERT INTO users (id, email, profile, role, is_active, status)
  VALUES (
    NEW.id,
    NEW.email,
    profile_id,
    'user',
    true,
    'active'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic user creation
DROP TRIGGER IF EXISTS on_auth_user_created_new ON auth.users;
CREATE TRIGGER on_auth_user_created_new
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_registration();

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Users can upload their own profile images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Profile images are publicly viewable"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-images');