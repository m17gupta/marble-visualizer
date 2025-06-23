import { AuthAPI } from '@/api/authApi';
import { 
  LoginCredentials, 
  SignUpCredentials, 
  AuthResponse, 
  
  User,
  UserProfile,
  UpdateAuthUserProfileRequest
} from '@/models';

export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    return AuthAPI.signIn(credentials);
  }

  /**
   * Sign up with email and password
   */
  static async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    return AuthAPI.signUp(credentials);
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    return AuthAPI.signOut();
  }

  /**
   * Get current user session
   */
  static async getCurrentSession() {
    return AuthAPI.getCurrentSession();
  }

  /**
   * Get current user with profile
   */
  static async getCurrentUser(): Promise<{ user: User; profile: UserProfile } | null> {
    return AuthAPI.getCurrentUser();
  }

  /**
   * Refresh current session
   */
  static async refreshSession() {
    return AuthAPI.refreshSession();
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: UpdateAuthUserProfileRequest): Promise<UserProfile> {
    return AuthAPI.updateUserProfile(userId, updates);
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<void> {
    return AuthAPI.resetPassword(email);
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
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
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
    return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
  }
}