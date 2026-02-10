import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService, AuthResponse, User } from '../api/auth';
import {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  VerifyOTPInput,
  ResetPasswordInput,
} from '../validation/auth';

export interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Login
  login: (credentials: LoginInput) => Promise<void>;
  
  // Register
  register: (data: RegisterInput) => Promise<void>;
  
  // Password Reset
  forgotPassword: (data: ForgotPasswordInput) => Promise<void>;
  verifyOTP: (data: VerifyOTPInput) => Promise<void>;
  resetPassword: (data: ResetPasswordInput) => Promise<void>;
  
  // Session
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check authentication on app start
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await authService.getCurrentUser();
      const isAuth = await authService.isAuthenticated();

      if (isAuth && currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = useCallback(async (credentials: LoginInput) => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AuthResponse = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterInput) => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AuthResponse = await authService.register(data);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Forgot Password
  const forgotPassword = useCallback(async (data: ForgotPasswordInput) => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.forgotPassword(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send reset email';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify OTP
  const verifyOTP = useCallback(async (data: VerifyOTPInput) => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.verifyOTP(data);
    } catch (err: any) {
      const errorMessage = err.message || 'OTP verification failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset Password
  const resetPassword = useCallback(async (data: ResetPasswordInput) => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.resetPassword(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Password reset failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    forgotPassword,
    verifyOTP,
    resetPassword,
    logout,
    clearError,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
