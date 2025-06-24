-- /*
--   # Authentication Schema

--   1. New Tables
--     - `profiles`
--       - `id` (uuid, primary key, references auth.users)
--       - `email` (text, unique)
--       - `full_name` (text, nullable)
--       - `avatar_url` (text, nullable)
--       - `role` (enum: admin, editor, viewer, vendor, user)
--       - `created_at` (timestamp)
--       - `updated_at` (timestamp)

--   2. Security
--     - Enable RLS on `profiles` table
--     - Add policies for authenticated users to read/update their own profile
--     - Add policy for users to read other profiles (for collaboration)
-- */

-- -- Create enum for user roles
-- CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer', 'vendor', 'user');

-- -- Create profiles table
-- CREATE TABLE IF NOT EXISTS profiles (
--   id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--   email text UNIQUE NOT NULL,
--   full_name text,
--   avatar_url text,
--   role user_role DEFAULT 'user',
--   created_at timestamptz DEFAULT now(),
--   updated_at timestamptz DEFAULT now()
-- );

-- -- Enable RLS
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- -- Policies for profiles table
-- CREATE POLICY "Users can read own profile"
--   ON profiles
--   FOR SELECT
--   TO authenticated
--   USING (auth.uid() = id);

-- CREATE POLICY "Users can update own profile"
--   ON profiles
--   FOR UPDATE
--   TO authenticated
--   USING (auth.uid() = id);

-- CREATE POLICY "Users can read other profiles"
--   ON profiles
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- -- Create function to handle user registration
-- CREATE OR REPLACE FUNCTION handle_new_user()
-- RETURNS trigger AS $$
-- BEGIN
--   INSERT INTO profiles (id, email, full_name)
--   VALUES (
--     NEW.id,
--     NEW.email,
--     COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
--   );
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- -- Create trigger for automatic profile creation
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION handle_new_user();

-- -- Create function to update updated_at timestamp
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS trigger AS $$
-- BEGIN
--   NEW.updated_at = now();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Create trigger for updated_at
-- CREATE TRIGGER update_profiles_updated_at
--   BEFORE UPDATE ON profiles
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at_column();