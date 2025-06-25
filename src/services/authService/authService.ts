import { AuthAPI } from "@/services/authService/api/authApi";
import {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
  User,
  UserProfile,
  UpdateAuthUserProfileRequest,
} from "@/models";

export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    return await AuthAPI.signIn(credentials);
  }

  /**
   * Sign up with email and password
   */
  static async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    return await AuthAPI.signUp(credentials);
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    return await AuthAPI.signOut();
  }

  /**
   * Get current user session
   */
  static async getCurrentSession() {
    return await AuthAPI.getCurrentSession();
  }

  /**
   * Get current user with profile
   */
  static async getCurrentUser(): Promise<{
    user: User;
    profile: UserProfile | null;
  } | null> {
    return await AuthAPI.getCurrentUser();
  }

  /**
   * Refresh current session
   */
  static async refreshSession() {
    return await AuthAPI.refreshSession();
  }

  /**
   * Get user profile by user ID
   */
  static async getUserProfileByUserId(
    userId: string
  ){
    return await AuthAPI.getUserProfileByUserId(userId);
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updates: UpdateAuthUserProfileRequest
  ): Promise<UserProfile> {
    // TODO: Implement updateUserProfile in AuthAPI
    console.log('UpdateProfile called with:', { userId, updates });
    throw new Error('Method not implemented');
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<void> {
    return await AuthAPI.resetPassword(email);
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate username from email
   */
  static generateUsernameFromEmail(email: string): string {
    return email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
  }
}
