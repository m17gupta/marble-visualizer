// Import User and UserProfile types
import { User, UserProfile, UserRole } from "./userModel/UserModel";
import { UserPlan } from "./userModel/UserPLanModel";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  profile?: UserProfile | null;
  userPlan?:UserPlan | null;

  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

export class AuthError extends Error {
  public status?: number;
  public code?: string;

  constructor(error: { message: string; status?: number; code?: string }) {
    super(error.message);
    this.name = "AuthError";
    this.status = error.status;
    this.code = error.code;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
  }
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UpdateAuthUserProfileRequest {
  name?: string;
  dob?: string;
  image?: string;
  image_thumb?: string;
  projects?: string;
}

export interface CreateAuthUserRequest {
  id: string;
  email: string;
  role: string;
  profile: string;
  is_active: boolean;
  status: string;
}
