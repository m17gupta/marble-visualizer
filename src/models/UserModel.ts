import { boolean } from "zod";

export interface User {
  id: string;
  email: string;
  password?: string; // Only used during creation, never stored in frontend
  role: UserRole;
  profile: string; // UUID reference to user_profiles
  is_active: boolean;
  status: UserStatus;
  password_otp?: number;
  last_login?: string;
  created_at: string;
  modified_at: string;
  version: number;
}

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  dob?: string; // Date of birth
  projects?: string; // JSON data
  image?: string;
  image_thumb?: string;
  created_at: string;
  modified_at: string;
  id: number; // Auto-increment ID
}

export type UserRole = "admin" | "realtor" | "vendor";
export type UserStatus = true | false;

export interface CreateUserRequest {
  email: string;
  password: string;
  full_name: string;
  dob?: string;
  role?: UserRole;
}

export interface CreateUserResponse {
  user: User;
  profile: UserProfile;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export interface UpdateUserProfileRequest {
  name?: string;
  dob?: string;
  image?: string;
  projects?: string;
}
