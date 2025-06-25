// import { User as SupabaseUser } from '@supabase/supabase-js'
import { Database } from './database'

export type UserRole = 'admin' | 'editor' | 'viewer' | 'vendor' | 'user'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  created_at: string
  updated_at: string
  profile?: UserProfile
  is_active?: boolean
  status?: 'active' | 'inactive' | 'suspended' | 'pending'
  modified_at?: string
  version?: number
}

export interface UserProfile {
  _id: string
  email: string
  name: string
  dob?: string | null
  projects?: Record<string, unknown>
  image?: string | null
  image_thumb?: string | null
  created_at: string
  modified_at: string
  id?: number
}

export type Profile = Database['public']['Tables']['user_profiles']['Row']

export interface AuthResponse {
  user: User
  session: {
    access_token: string
    refresh_token: string
    expires_at: number
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  full_name: string
}

export interface AuthError {
  message: string
  status?: number
}