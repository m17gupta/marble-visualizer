import { supabase } from '@/lib/supabase';
import { User, UserProfile, UpdateUserProfileRequest, AuthError } from '@/models';
import { UserPlan } from '@/models/userModel/UserPLanModel';

export class UserAPI {
  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw new AuthError({
          message: error.message,
          status: 404,
          code: 'USER_NOT_FOUND'
        });
      }

      return data;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: 'Failed to fetch user',
        status: 500,
        code: 'USER_FETCH_ERROR'
      });
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        
        throw new AuthError({
          message: error.message,
          status: 404,
          code: 'PROFILE_NOT_FOUND'
        });
      }

      return data;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: 'Failed to fetch user profile',
        status: 500,
        code: 'PROFILE_FETCH_ERROR'
      });
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: UpdateUserProfileRequest): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          modified_at: new Date().toISOString(),
        })
        .eq('_id', userId)
        .select()
        .single();

      if (error) {
        throw new AuthError({
          message: error.message,
          status: 400,
          code: 'PROFILE_UPDATE_ERROR'
        });
      }

      return data;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: 'Failed to update user profile',
        status: 500,
        code: 'PROFILE_UPDATE_FAILED'
      });
    }
  }


  // update the credit balance for a user
  static async updateUserCredits(userId: string, credits: number): Promise<UserPlan>
  {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          credits: credits,
          modified_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new AuthError({
          message: error.message,
          status: 400,
          code: 'CREDITS_UPDATE_ERROR'
        });
      }

      return data;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: 'Failed to update user credits',
        status: 500,
        code: 'CREDITS_UPDATE_FAILED'
      });
    }
  }
  /**
   * Update user status
   */
  // static async updateUserStatus(userId: string, status: string, isActive: boolean): Promise<User> {
  //   try {
  //     const { data, error } = await supabase
  //       .from('users')
  //       .update({
  //         status,
  //         is_active: isActive,
  //         modified_at: new Date().toISOString(),
  //         version: supabase.raw('version + 1'),
  //       })
  //       .eq('id', userId)
  //       .select()
  //       .single();

  //     if (error) {
  //       throw new AuthError({
  //         message: error.message,
  //         status: 400,
  //         code: 'USER_UPDATE_ERROR'
  //       });
  //     }

  //     return data;
  //   } catch (error) {
  //     if (error instanceof AuthError) {
  //       throw error;
  //     }
  //     throw new AuthError({
  //       message: 'Failed to update user status',
  //       status: 500,
  //       code: 'USER_UPDATE_FAILED'
  //     });
  //   }
  // }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(page: number = 1, limit: number = 20): Promise<{
    users: User[];
    profiles: UserProfile[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;

      // Get users with pagination
      const { data: users, error: usersError, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (usersError) {
        throw new AuthError({
          message: usersError.message,
          status: 400,
          code: 'USERS_FETCH_ERROR'
        });
      }

      // Get corresponding profiles
      const userIds = users.map(user => user.id);
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('_id', userIds);

      if (profilesError) {
        throw new AuthError({
          message: profilesError.message,
          status: 400,
          code: 'PROFILES_FETCH_ERROR'
        });
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        users,
        profiles: profiles || [],
        total: count || 0,
        page,
        totalPages,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: 'Failed to fetch users',
        status: 500,
        code: 'USERS_FETCH_FAILED'
      });
    }
  }

  /**
   * Search users by email or name
   */
  static async searchUsers(query: string, limit: number = 10): Promise<{
    users: User[];
    profiles: UserProfile[];
  }> {
    try {
      // Search in profiles first
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(limit);

      if (profilesError) {
        throw new AuthError({
          message: profilesError.message,
          status: 400,
          code: 'SEARCH_ERROR'
        });
      }

      // Get corresponding users
      const userIds = profiles.map(profile => profile._id);
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .in('id', userIds);

      if (usersError) {
        throw new AuthError({
          message: usersError.message,
          status: 400,
          code: 'USERS_FETCH_ERROR'
        });
      }

      return {
        users: users || [],
        profiles: profiles || [],
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        message: 'Failed to search users',
        status: 500,
        code: 'SEARCH_FAILED'
      });
    }
  }

  /**
   * Upload profile image
   */
  // static async uploadProfileImage(userId: string, file: File): Promise<{ url: string; thumbUrl: string }> {
  //   try {
  //     const fileExt = file.name.split('.').pop();
  //     const fileName = `${userId}.${fileExt}`;
  //     const thumbFileName = `${userId}_thumb.${fileExt}`;

  //     // Upload original image
  //     const { data: uploadData, error: uploadError } = await supabase.storage
  //       .from('profile-images')
  //       .upload(fileName, file, {
  //         upsert: true,
  //       });

  //     if (uploadError) {
  //       throw new AuthError({
  //         message: uploadError.message,
  //         status: 400,
  //         code: 'IMAGE_UPLOAD_ERROR'
  //       });
  //     }

  //     // Get public URLs
  //     const { data: urlData } = supabase.storage
  //       .from('profile-images')
  //       .getPublicUrl(fileName);

  //     const { data: thumbUrlData } = supabase.storage
  //       .from('profile-images')
  //       .getPublicUrl(thumbFileName);

  //     // Update user profile with image URLs
  //     await this.updateUserProfile(userId, {
  //       image: urlData.publicUrl,
  //       image_thumb: thumbUrlData.publicUrl,
  //     });

  //     return {
  //       url: urlData.publicUrl,
  //       thumbUrl: thumbUrlData.publicUrl,
  //     };
  //   } catch (error) {
  //     if (error instanceof AuthError) {
  //       throw error;
  //     }
  //     throw new AuthError({
  //       message: 'Failed to upload profile image',
  //       status: 500,
  //       code: 'IMAGE_UPLOAD_FAILED'
  //     });
  //   }
  // }
}