import { supabase } from "@/lib/supabase";
import {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
  AuthError,
  UpdateAuthUserProfileRequest,
  CreateAuthUserRequest,
  User,
  UserProfile,
} from "@/models";

export class AuthAPI {
  /**
   * Sign in with email and password
   */
  static async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new AuthError({
          message: error.message,
          status: 400,
          code: error.name || "SIGN_IN_ERROR",
        });
      }

      if (!data.user || !data.session) {
        throw new AuthError({
          message: "Authentication failed",
          status: 401,
          code: "AUTH_FAILED",
        });
      }

      // Update last login
      await this.updateLastLogin(data.user.id);

      // Get user and profile data
      // const [user, profile] = await Promise.all([
      //   this.getUserById(data.user.id),
      //   this.getUserProfile(data.user.id),
      // ]);

      // console.log(data.user, data.session)

      // return {
      //   user,
      //   profile,
      //   session: {
      //     access_token: data.session.access_token,
      //     refresh_token: data.session.refresh_token,
      //     expires_at: data.session.expires_at!,
      //   },
      // };

      //changes by himanshu
      return {
        user: data.user,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at!,
        },
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "An unexpected error occurred during sign in",
        status: 500,
        code: "UNEXPECTED_ERROR",
      });
    }
  }

  /**
   * Sign up with email and password
   */
  static async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const finalUser: {
        email: string;
        password: string;
        options: any;
      } = {
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.full_name,
          },
        },
      };

      // First create the Supabase auth user
      const { data, error } = await supabase.auth.signUp(finalUser);

      // const {data, error } = await supabase.from("user_profile").insert({
      //   id: userId,
      //   role: credentials?.role ? credentials.role : "user",
      //   full_name: credentials.full_name
      // })

      if (error) {
        throw new AuthError({
          message: error.message,
          status: 400,
          code: error.name || "SIGN_UP_ERROR",
        });
      }

      if (!data.user || !data.session) {
        throw new AuthError({
          message: "Registration failed",
          status: 400,
          code: "REGISTRATION_FAILED",
        });
      }

      const profileData = {
        user_id: data.user.id,
        full_name: credentials.full_name,
        role: credentials?.role ? credentials.role : "user",
      };

      // Create user profile in user_profiles table
      const profile = await this.createUserProfile(profileData);

      console.log(profile);

      // Create user record in users table
      // const user = await this.createUser({
      //   id: data.user.id,
      //   email: data.user.email!,
      //   role: "user",
      //   profile: profile._id,
      //   is_active: true,
      //   status: "active",
      // });

      return {
        user: data.user,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at!,
        },
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "An unexpected error occurred during registration",
        status: 500,
        code: "UNEXPECTED_ERROR",
      });
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    try {
      // Use the scope parameter to clear all storage types
      const { error } = await supabase.auth.signOut({ scope: "global" });

      if (error) {
        throw new AuthError({
          message: error.message,
          status: 400,
          code: error.name || "SIGN_OUT_ERROR",
        });
      }

      // Manually clear browser storage as well for redundancy
      localStorage.removeItem("supabase.auth.token");
      sessionStorage.removeItem("supabase.auth.token");

      // Clear any other auth-related local storage items
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("supabase.auth.")) {
          localStorage.removeItem(key);
        }
      });

      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("supabase.auth.")) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "An unexpected error occurred during sign out",
        status: 500,
        code: "UNEXPECTED_ERROR",
      });
    }
  }

  /**
   * Get current user session
   */
  static async getCurrentSession() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw new AuthError({
          message: error.message,
          status: 401,
          code: error.name || "SESSION_ERROR",
        });
      }

      return data.session;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "Failed to get current session",
        status: 500,
        code: "SESSION_FETCH_ERROR",
      });
    }
  }

  /**
   * Get current user with profile
   */
  static async getCurrentUser(): Promise<{
    user: User;
    profile: UserProfile;
  } | null> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw new AuthError({
          message: error.message,
          status: 401,
          code: error.name || "USER_FETCH_ERROR",
        });
      }

      if (!data.user) {
        return null;
      }

      // const [user, profile] = await Promise.all([
      //   this.getUserById(data.user.id),
      //   this.getUserProfile(data.user.id),
      // ]);

      return { user: data.user, profile: null };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      return null;
    }
  }

  /**
   * Update user profile
   */
  // static async updateUserProfile(
  //   userId: string,
  //   updates: UpdateAuthUserProfileRequest
  // ): Promise<UserProfile> {
  //   try {
  //     const { data, error } = await supabase
  //       .from("user_profiles")
  //       .update({
  //         ...updates,
  //         modified_at: new Date().toISOString(),
  //       })
  //       .eq("_id", userId)
  //       .select()
  //       .single();

  //     if (error) {
  //       throw new AuthError({
  //         message: error.message,
  //         status: 400,
  //         code: "PROFILE_UPDATE_ERROR",
  //       });
  //     }

  //     return data;
  //   } catch (error) {
  //     if (error instanceof AuthError) {
  //       throw error;
  //     }
  //     throw new AuthError({
  //       message: "Failed to update profile",
  //       status: 500,
  //       code: "PROFILE_UPDATE_FAILED",
  //     });
  //   }
  // }

  /**
   * Create user record in users table
   */
  // private static async createUser(
  //   userData: CreateAuthUserRequest
  // ): Promise<User> {
  //   const { data, error } = await supabase
  //     .from("users")
  //     .insert({
  //       id: userData.id,
  //       email: userData.email,
  //       role: userData.role,
  //       profile: userData.profile,
  //       is_active: userData.is_active,
  //       status: userData.status,
  //       version: 1,
  //       created_at: new Date().toISOString(),
  //       modified_at: new Date().toISOString(),
  //     })
  //     .select()
  //     .single();

  //   if (error) {
  //     throw new AuthError({
  //       message: `Failed to create user: ${error.message}`,
  //       status: 400,
  //       code: "USER_CREATE_ERROR",
  //     });
  //   }

  //   return data;
  // }

  /**
   * Create user profile in user_profiles table
   */
  private static async createUserProfile(profileData: {
    user_id: string;
    role: string;
    full_name: string;
  }): Promise<UserProfile> {
    console.log(profileData);

    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        user_id: profileData.user_id,
        role: profileData.role,
        full_name: profileData.full_name,
      })
      .select()
      .single();

    if (error) {
      throw new AuthError({
        message: `Failed to create user profile: ${error.message}`,
        status: 400,
        code: "PROFILE_CREATE_ERROR",
      });
    }

    return data;
  }

  /**
   * Get user by ID from users table
   */
  private static async getUserById(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new AuthError({
        message: `Failed to get user: ${error.message}`,
        status: 404,
        code: "USER_NOT_FOUND",
      });
    }

    return data;
  }

  /**
   * Get user profile by ID from user_profiles table
   */
  // private static async getUserProfile(userId: string): Promise<UserProfile> {
  //   const { data, error } = await supabase
  //     .from("user_profiles")
  //     .select("*")
  //     .eq("_id", userId)
  //     .single();

  //   if (error) {
  //     throw new AuthError({
  //       message: `Failed to get user profile: ${error.message}`,
  //       status: 404,
  //       code: "PROFILE_NOT_FOUND",
  //     });
  //   }

  //   return data;
  // }

  /**
   * Update last login timestamp
   */
  private static async updateLastLogin(userId: string): Promise<void> {
    await supabase
      .from("users")
      .update({
        last_login: new Date().toISOString(),
        modified_at: new Date().toISOString(),
      })
      .eq("id", userId);
  }

  /**
   * Refresh current session
   */
  static async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        throw new AuthError({
          message: error.message,
          status: 401,
          code: error.name || "REFRESH_ERROR",
        });
      }

      return data.session;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "Failed to refresh session",
        status: 500,
        code: "REFRESH_FAILED",
      });
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new AuthError({
          message: error.message,
          status: 400,
          code: error.name || "RESET_PASSWORD_ERROR",
        });
      }
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "Failed to send reset password email",
        status: 500,
        code: "RESET_PASSWORD_FAILED",
      });
    }
  }
}
