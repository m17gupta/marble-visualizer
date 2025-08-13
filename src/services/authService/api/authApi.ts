import { supabase } from "@/lib/supabase";
import {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
  AuthError,
  User,
  UserProfile,
} from "@/models";
import { UserPlan, PlanFeature } from "@/models/userModel/UserPLanModel";

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
      // const userPlan = await this.getUserPlan(data.user.id);
  //  console.log("User plan fetched:", data.user);
      const userAuth: User = {
        id: data.user.id,
        email: data.user.email || "",
        name: data.user.user_metadata?.full_name || "",
        profile: 0, // Default profile ID or fetch from database
        is_active: true,
        status: "active",
        created_at: data.user.created_at || new Date().toISOString(),
        modified_at: new Date().toISOString(),
      };

      return {
        user: userAuth,
        // userPlan: userPlan || null,
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
        options: {
          data: {
            full_name: string;
          };
        };
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
        role: this.validateUserRole(credentials?.role),
      };

      // Create user profile in user_profiles table
      const profile = await this.createUserProfile(profileData);

      const userAuth: User = {
        id: data.user.id,
        email: data.user.email || "",
        profile: profile.id ?? 0, // Use the created profile ID
        is_active: true,
        status: "active",
        created_at: data.user.created_at || new Date().toISOString(),
        modified_at: new Date().toISOString(),
      };

      return {
        user: userAuth,
        profile: profile,
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
    profile: UserProfile | null;
    userPlan: UserPlan | null;
  } | null> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        // Handle "Auth session missing!" as a normal case when user is not logged in
        if (error.message === "Auth session missing!") {
          return null;
        }

        throw new AuthError({
          message: error.message,
          status: 401,
          code: error.name || "USER_FETCH_ERROR",
        });
      }

      if (!data.user) {
        return null;
      }

      // Get user plan
      const userPlan = await this.getUserPlan(data.user.id);

      const userAuth: User = {
        id: data.user.id,
        email: data.user.email || "",
         name: data.user.user_metadata?.full_name || "",
        profile: 0, // Default profile ID or fetch from database
        is_active: true,
        status: "active",
        created_at: data.user.created_at || new Date().toISOString(),
        modified_at: new Date().toISOString(),
      };

      return { user: userAuth, profile: null, userPlan: userPlan || null };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      // For any other unexpected errors, return null instead of throwing
      console.error("Unexpected error in getCurrentUser:", error);
      return null;
    }
  }

  // get current user profile based on userId
  static async getUserProfileByUserId(
    userId: string
  ): Promise<UserProfile | null> {
    try {
      // First, check if user_profiles table exists and has data
      const response = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId);

      if (response.error) {
        console.error(
          "getUserProfileByUserId - Database error:",
          response.error
        );

        // If table doesn't exist, let's debug what tables are available
        if (
          response.error.message.includes(
            'relation "public.user_profiles" does not exist'
          )
        ) {
          await this.debugDatabaseTables();

          // Try with profiles table instead
          const profilesResponse = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId);

          if (profilesResponse.error) {
            throw new AuthError({
              message: `Failed to get user profile from both tables: ${profilesResponse.error.message}`,
              status: 500,
              code: "PROFILE_QUERY_ERROR",
            });
          }

          if (!profilesResponse.data || profilesResponse.data.length === 0) {
            return null;
          }

          // Map profiles table data to UserProfile interface
          const profileData = profilesResponse.data[0];
          return {
            id: 0,
            user_id: profileData.id,
            full_name:
              profileData.full_name || profileData.email?.split("@")[0] || "",
            role: profileData.role || "user",
            profile_image: profileData.avatar_url,
            status: true,
            created_at: profileData.created_at,
            updated_at: profileData.updated_at,
          } as UserProfile;
        }

        throw new AuthError({
          message: `Failed to get user profile: ${response.error.message}`,
          status: 500,
          code: "PROFILE_QUERY_ERROR",
        });
      }

      // If no rows found, return null
      if (!response.data || response.data.length === 0) {
        const allProfilesResponse = await supabase
          .from("user_profiles")
          .select("user_id, full_name")
          .limit(5);

        return null;
      }

      // If multiple rows found, log warning and return the first one
      if (response.data.length > 1) {
        console.warn(
          `getUserProfileByUserId - Multiple profiles found for userId: ${userId}, returning first one`
        );
      }

      return response.data[0] as UserProfile;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "Failed to get user profile",
        status: 500,
        code: "USER_PROFILE_FETCH_ERROR",
      });
    }
  }

  /**
   * Create user profile in profiles table
   */
  static async createUserProfile(profileData: {
    user_id: string;
    role: string;
    full_name: string;
    session_id?: string;
  }): Promise<UserProfile> {
    // Generate a UUID if user_id is empty or null
    if (!profileData.user_id || profileData.user_id === "") {
      profileData.user_id = crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString();
    }

    // For profiles table, we need to map the fields correctly
    const insertData = {
      user_id: profileData.user_id || "",
      role: profileData.role || "",
      full_name: profileData.full_name || "",
      profile_image: "",
      status: true,
      session_id: profileData.session_id || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Try user_profiles first, then fallback to profiles
    const response = await supabase
      .from("user_profiles")
      .insert(insertData)
      .select()
      .single();

    // If user_profiles table doesn't exist, use profiles table
    if (
      response.error &&
      response.error.message.includes(
        'relation "public.user_profiles" does not exist'
      )
    ) {
      console.log("user_profiles table doesn't exist, using profiles table");
    }

    if (response.error) {
      console.log("Error creating user profile:", response.error);
      console.log("Error details:", {
        message: response.error.message,
        details: response.error.details,
        hint: response.error.hint,
        code: response.error.code,
      });
      throw new AuthError({
        message: `Failed to create user profile: ${response.error.message}`,
        status: 400,
        code: "PROFILE_CREATE_ERROR",
      });
    }

    // Map profiles table data to UserProfile interface
    const profileResult = response.data;
    if (!profileResult.user_id) {
      // If using profiles table, map the fields
      return {
        id: profileResult.id,
        user_id: profileResult.user_id || "",
        full_name: profileResult.full_name || "",
        role: profileResult.role || "",
        profile_image: profileResult.avatar_url || "",
        session_id: profileResult.session_id || "",
        status: true,
        created_at: profileResult.created_at,
        updated_at: profileResult.updated_at,
      } as UserProfile;
    }

    return profileResult;
  }

  /**
   * Get user profile by user ID from profiles/user_profiles table
   */
  static async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      // Try user_profiles first, then fallback to profiles
      let response = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      // If user_profiles table doesn't exist, use profiles table
      if (
        response.error &&
        response.error.message.includes(
          'relation "public.user_profiles" does not exist'
        )
      ) {
        response = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (!response.error && response.data) {
          // Map profiles data to UserProfile interface
          return {
            id: 0,
            user_id: response.data.id,
            full_name: response.data.full_name,
            role: response.data.role,
            profile_image: response.data.avatar_url,
            status: true,
            created_at: response.data.created_at,
            updated_at: response.data.updated_at,
          } as UserProfile;
        }
      }

      if (response.error) {
        throw new AuthError({
          message: `Failed to get user profile: ${response.error.message}`,
          status: 404,
          code: "PROFILE_NOT_FOUND",
        });
      }

      return response.data;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "Failed to retrieve user profile",
        status: 500,
        code: "PROFILE_FETCH_ERROR",
      });
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    try {
      // Try user_profiles first, then fallback to profiles

      const response = await supabase
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (!response.error && response.data) {
        // Map profiles data back to UserProfile interface
        return {
          id: response.data.id,
          user_id: response.data.user_id,
          full_name: response.data.full_name,
          role: response.data.role,
          profile_image: response.data.avatar_url,
          status: true,
          created_at: response.data.created_at,
          updated_at: response.data.updated_at,
          favorite_materials: response.data.favorite_materials,
        } as UserProfile;
      }
      // If user_profiles table doesn't exist, use profiles table
      // if (
      //   response.error &&
      //   response.error.message.includes(
      //     'relation "public.user_profiles" does not exist'
      //   )
      // )
      // {
      //   // Map UserProfile updates to profiles table format
      //   const profileUpdates = {
      //     full_name: updates.full_name,
      //     role: updates.role,
      //     avatar_url: updates.profile_image,
      //     updated_at: new Date().toISOString(),
      //     favorite_materials: [],
      //   };

      //   // response = await supabase
      //   //   .from("profiles")
      //   //   .update(profileUpdates)
      //   //   .eq("id", userId)
      //   //   .select()
      //   //   .single();

      //   if (!response.error && response.data) {
      //     // Map profiles data back to UserProfile interface
      //     return {
      //       id: 0,
      //       user_id: response.data.id,
      //       full_name: response.data.full_name,
      //       role: response.data.role,
      //       profile_image: response.data.avatar_url,
      //       status: true,
      //       created_at: response.data.created_at,
      //       updated_at: response.data.updated_at,
      //       favorite_materials: response.data.favorite_materials,
      //     } as UserProfile;
      //   }
      // }

      if (response.error) {
        throw new AuthError({
          message: `Failed to update user profile: ${response.error.message}`,
          status: 400,
          code: "PROFILE_UPDATE_ERROR",
        });
      }

      return response.data;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "Failed to update user profile",
        status: 500,
        code: "PROFILE_UPDATE_FAILED",
      });
    }
  }

  /**
   * Get user profile based on user session ID
   * Get user profile based on user session ID
   */
  static async getUserProfileBySessionId(
    sessionId: string
  ): Promise<UserProfile | null> {
    try {
      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("session_id", sessionId);

      console.log("getUserProfileBySessionId - Data:", data);
      if (!data || data.length === 0) {
        return null;
      }
      return data[0] as UserProfile;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "Failed to retrieve user profile",
        status: 500,
        code: "PROFILE_FETCH_ERROR",
      });
    }
  }

  /**
   * Upload user profile image
   */
  static async uploadProfileImage(
    userId: string,
    file: File
  ): Promise<{ imageUrl: string }> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("user-profiles")
        .upload(filePath, file);

      if (uploadError) {
        throw new AuthError({
          message: `Failed to upload image: ${uploadError.message}`,
          status: 400,
          code: "IMAGE_UPLOAD_ERROR",
        });
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("user-profiles").getPublicUrl(filePath);

      // Update user profile with new image URL
      await this.updateUserProfile(userId, { profile_image: publicUrl });

      return { imageUrl: publicUrl };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "Failed to upload profile image",
        status: 500,
        code: "IMAGE_UPLOAD_FAILED",
      });
    }
  }

  /**
   * Delete user profile image
   */
  static async deleteProfileImage(
    userId: string,
    imageUrl: string
  ): Promise<void> {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `profiles/${fileName}`;

      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from("user-profiles")
        .remove([filePath]);

      if (deleteError) {
        console.warn(`Failed to delete image file: ${deleteError.message}`);
        // Don't throw error here, continue to update profile
      }

      // Update user profile to remove image URL
      await this.updateUserProfile(userId, { profile_image: undefined });
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "Failed to delete profile image",
        status: 500,
        code: "IMAGE_DELETE_FAILED",
      });
    }
  }

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

  // get user plan
  static async getUserPlan(userId: string): Promise<UserPlan > {
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        throw new AuthError({
          message: error.message,
          status: 404,
          code: "USER_PLAN_NOT_FOUND",
        });
      }
   
    let userPlanWithFeature: UserPlan | null = null;
     userPlanWithFeature = {
      id: data.id,
      user_id: data.user_id,
      status: data.status,
      started_at: data.start_date,
      expires_at: data.end_date,
      payment_id: data.created_at,
      created_at: data.updated_at,
      credits: data.credits || 0,
      // Include plan feature if available
    };
    if(data && data.plan_feature_id) {
    const user_plan_feature = await this.searchPlanFeature(data.plan_feature_id);
   
    if (user_plan_feature) {
      userPlanWithFeature.plan_features = user_plan_feature || null;
    } else {
      console.warn("No plan feature found for user plan:", data.plan_feature_id);
    }
  

    if (!userPlanWithFeature) {
        console.warn("No plan feature found for user plan:", userPlanWithFeature);
   }
  }
      return userPlanWithFeature as UserPlan;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "Failed to retrieve user plan",
        status: 500,
        code: "USER_PLAN_FETCH_ERROR",
      });
    }
  }

  // searcg plan under plan_featuer table
  static async searchPlanFeature(
    planId: string
  ): Promise<PlanFeature | null> {
    try {
      const { data, error } = await supabase
        .from("plan_features")
        .select("*")
        .eq("id", planId)
        .single();

      if (error) {
        throw new AuthError({
          message: error.message,
          status: 404,
          code: "PLAN_FEATURE_NOT_FOUND",
        });
      }

      return data as PlanFeature;
    } catch (error) {
      console.error("Error searching plan feature:", error);
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: "Failed to retrieve plan feature",
        status: 500,
        code: "PLAN_FEATURE_FETCH_ERROR",
      });
    }
  }

  /**
   * Refresh current session
   */
  static async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
       console.log("Refresh session data:", data);
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

  /**
   * Validate and sanitize user role
   */
  private static validateUserRole(role?: string): string {
    const validRoles = [
      "admin",
      "user",
      "viewer",
      "vendor",
      "designer",
      "customer",
    ];
    if (!role || !validRoles.includes(role)) {
      return "user"; // Default to 'user' if invalid role
    }
    return role;
  }

  /**
   * Debug method to check what tables exist and their structure
   */
  static async debugDatabaseTables() {
    try {
      console.log("=== DEBUGGING DATABASE TABLES ===");

      // Try to query user_profiles table
      const userProfilesResponse = await supabase
        .from("user_profiles")
        .select("*", { count: "exact" })
        .limit(1);

      console.log("user_profiles table response:", userProfilesResponse);

      // Try to query profiles table
      const profilesResponse = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .limit(1);

      console.log("profiles table response:", profilesResponse);

      return {
        user_profiles: userProfilesResponse,
        profiles: profilesResponse,
      };
    } catch (error) {
      console.error("Error debugging tables:", error);
      return null;
    }
  }

  /**
   * Ensure user profile exists, create if not found
   */
  static async ensureUserProfile(
    userId: string,
    email?: string,
    fullName?: string
  ): Promise<UserProfile> {
    try {
      // First try to get existing profile
      const existingProfile = await this.getUserProfileByUserId(userId);

      if (existingProfile) {
        return existingProfile;
      }

      // If no profile exists, create one

      const profileData = {
        user_id: userId,
        full_name: fullName || email?.split("@")[0] || "User",
        role: "user",
      };

      return await this.createUserProfile(profileData);
    } catch (error) {
      console.error("Error ensuring user profile:", error);
      throw error;
    }
  }
}
