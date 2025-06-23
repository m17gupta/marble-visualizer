/*
  # Projects Schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, nullable)
      - `visibility` (enum: public, private)
      - `is_public` (boolean)
      - `public_slug` (text, nullable, unique)
      - `thumbnail` (text, nullable)
      - `progress` (integer, 0-100)
      - `status` (enum: active, completed, paused)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `project_access`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `user_id` (uuid, references profiles)
      - `role` (enum: admin, editor, viewer)
      - `added_by` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for project access control
*/

-- Create enums
CREATE TYPE project_visibility AS ENUM ('public', 'private');
CREATE TYPE project_status AS ENUM ('active', 'completed', 'paused');
CREATE TYPE access_role AS ENUM ('admin', 'editor', 'viewer');

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  visibility project_visibility DEFAULT 'private',
  is_public boolean DEFAULT false,
  public_slug text UNIQUE,
  thumbnail text,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status project_status DEFAULT 'active',
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_access table
CREATE TABLE IF NOT EXISTS project_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role access_role DEFAULT 'viewer',
  added_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_access ENABLE ROW LEVEL SECURITY;

-- Policies for projects table
CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read public projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can read projects they have access to"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT project_id FROM project_access WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Project owners can update their projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Project admins can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT project_id FROM project_access 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Project owners can delete their projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for project_access table
CREATE POLICY "Users can read access for their projects"
  ON project_access
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read their own access"
  ON project_access
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Project owners can manage access"
  ON project_access
  FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Project admins can manage access"
  ON project_access
  FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT project_id FROM project_access 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to automatically add project owner to access table
CREATE OR REPLACE FUNCTION add_project_owner_access()
RETURNS trigger AS $$
BEGIN
  INSERT INTO project_access (project_id, user_id, role, added_by)
  VALUES (NEW.id, NEW.user_id, 'admin', NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic access creation
CREATE TRIGGER on_project_created
  AFTER INSERT ON projects
  FOR EACH ROW
  EXECUTE FUNCTION add_project_owner_access();

-- Create trigger for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();