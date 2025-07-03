export interface User {
  id: string;
  email: string;
  password?: string;
  profile: number;
  is_active?: boolean;
  status?: UserStatus;
  last_login?: string;
  created_at: string;
  modified_at: string;
   // UUID reference to session

}

export interface UserProfile {
  id?: number;
  user_id: string; // UUID reference to user
  full_name: string;
  role: string;
  profile_image?: string; // URL to profile image
  subscription_id?: string; // UUID reference to subscription
  session_id?: string;
  status: boolean
  created_at?: string;
  updated_at?: string;

}

export type UserRole = "admin" | "designer" | "viewer" | "vendor" | "user";
export type UserStatus = "active" | "inactive" | "suspended" | "pending";

export interface CreateUserRequest {
  user_id: string; // UUID reference to user
  full_name: string;
  role: string;
  profile_image?: string; // URL to profile image
  subscription_id?: string; // UUID reference to subscription
  status: boolean
  created_at?: string;
  updated_at?: string;
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
   user_id: string; // UUID reference to user
  full_name: string;
  role: string;
  profile_image?: string; // URL to profile image
  subscription_id?: string; // UUID reference to subscription
  status: boolean
}
