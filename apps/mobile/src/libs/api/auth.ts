import api from './client';
import * as SecureStore from 'expo-secure-store';
import { 
  LoginInput, 
  RegisterInput, 
  ForgotPasswordInput, 
  VerifyOTPInput, 
  ResetPasswordInput 
} from '../validation/auth';

// Types
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  userType: 'customer' | 'handyman';
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthToken;
}

// Mock user database
const MOCK_USERS: Record<string, any> = {
  'customer@fixit.local': {
    id: 'user_123',
    email: 'customer@fixit.local',
    fullName: 'John Customer',
    userType: 'customer',
    password: 'Password123!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer',
  },
  'handyman@fixit.local': {
    id: 'user_456',
    email: 'handyman@fixit.local',
    fullName: 'Jane Handyman',
    userType: 'handyman',
    password: 'Password123!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=handyman',
  },
};

// Mock OTP storage
const MOCK_OTPS: Record<string, { otp: string; expiresAt: number }> = {};

// Generate mock OTP
const generateMockOTP = () => Math.random().toString().slice(2, 8);

// Login service
export const authService = {
  // Login with email and password
  async login(credentials: LoginInput): Promise<AuthResponse> {
    try {
      // Mock API call - replace with real API endpoint
      const user = MOCK_USERS[credentials.email];

      if (!user || user.password !== credentials.password) {
        throw {
          message: 'Invalid email or password',
          code: 401,
        };
      }

      // Generate mock tokens
      const accessToken = `access_${Date.now()}_${Math.random()}`;
      const refreshToken = `refresh_${Date.now()}_${Math.random()}`;

      const authResponse: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          userType: user.userType,
          avatar: user.avatar,
          createdAt: new Date().toISOString(),
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 3600, // 1 hour
        },
      };

      // Store tokens securely
      await SecureStore.setItemAsync('auth_token', accessToken);
      await SecureStore.setItemAsync('refresh_token', refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(authResponse.user));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      return authResponse;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  async register(data: RegisterInput): Promise<AuthResponse> {
    try {
      // Check if user already exists
      if (MOCK_USERS[data.email]) {
        throw {
          message: 'Email already registered',
          code: 409,
        };
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email: data.email,
        fullName: data.fullName,
        userType: data.userType,
        password: data.password,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
      };

      MOCK_USERS[data.email] = newUser;

      // Generate tokens
      const accessToken = `access_${Date.now()}_${Math.random()}`;
      const refreshToken = `refresh_${Date.now()}_${Math.random()}`;

      const authResponse: AuthResponse = {
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          userType: newUser.userType,
          avatar: newUser.avatar,
          createdAt: new Date().toISOString(),
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 3600,
        },
      };

      // Store tokens
      await SecureStore.setItemAsync('auth_token', accessToken);
      await SecureStore.setItemAsync('refresh_token', refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(authResponse.user));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return authResponse;
    } catch (error) {
      throw error;
    }
  },

  // Request password reset
  async forgotPassword(data: ForgotPasswordInput): Promise<{ message: string }> {
    try {
      // Check if user exists
      if (!MOCK_USERS[data.email]) {
        // Return success even if user doesn't exist for security
        console.log('Password reset email sent to:', data.email);
        await new Promise((resolve) => setTimeout(resolve, 600));
        return { message: 'Check your email for password reset instructions' };
      }

      // Generate and store OTP
      const otp = generateMockOTP();
      MOCK_OTPS[data.email] = {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      };

      console.log(`Mock OTP for ${data.email}: ${otp}`);
      // In real implementation, send OTP via email

      await new Promise((resolve) => setTimeout(resolve, 600));

      return { message: 'OTP sent to your email' };
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP
  async verifyOTP(data: VerifyOTPInput): Promise<{ message: string }> {
    try {
      const storedOTP = MOCK_OTPS[data.email];

      if (!storedOTP) {
        throw {
          message: 'OTP not found. Please request a new one.',
          code: 400,
        };
      }

      if (storedOTP.expiresAt < Date.now()) {
        delete MOCK_OTPS[data.email];
        throw {
          message: 'OTP has expired. Please request a new one.',
          code: 400,
        };
      }

      if (storedOTP.otp !== data.otp) {
        throw {
          message: 'Invalid OTP',
          code: 400,
        };
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      return { message: 'OTP verified successfully' };
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  async resetPassword(data: ResetPasswordInput): Promise<{ message: string }> {
    try {
      const user = MOCK_USERS[data.email];

      if (!user) {
        throw {
          message: 'User not found',
          code: 404,
        };
      }

      // Verify OTP before resetting
      const storedOTP = MOCK_OTPS[data.email];
      if (!storedOTP || storedOTP.otp !== data.otp) {
        throw {
          message: 'Invalid or expired OTP',
          code: 400,
        };
      }

      // Update password
      user.password = data.newPassword;
      delete MOCK_OTPS[data.email];

      await new Promise((resolve) => setTimeout(resolve, 700));

      return { message: 'Password reset successfully. Please login with your new password.' };
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = await SecureStore.getItemAsync('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('user');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      return !!token;
    } catch (error) {
      return false;
    }
  },
};
