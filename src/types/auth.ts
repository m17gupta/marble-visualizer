import { User as SupabaseUser } from '@supabase/supabase-js'
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
}

export interface Profile extends Database['public']['Tables']['profiles']['Row'] {}

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