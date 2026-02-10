'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '@fix-it/api';
import type { User } from '@fix-it/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<{ registrationToken: string }>;
  verifyOtp: (email: string, otp: string, registrationToken: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ resetToken: string }>;
  verifyResetOtp: (email: string, otp: string, resetToken: string) => Promise<{ verificationToken: string }>;
  resetPassword: (email: string, newPassword: string, verificationToken: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  role: 'CUSTOMER' | 'HANDYMAN';
  fullName: string;
  phoneNumber: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const response = await authService.getCurrentUser();
        if (response) {
          setUser(response);
        }
      } catch (err) {
        // User is not authenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === 'object' && err !== null && 'message' in err) {
      setError((err as Record<string, any>).message);
    } else {
      setError('An unexpected error occurred');
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login({ email, password });
      if (response.user) {
        setUser(response.user);
      }
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.register(data);
      return { registrationToken: response.registrationToken };
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const verifyOtp = useCallback(async (email: string, otp: string, registrationToken: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.verifyOtp({ email, otp, registrationToken });
      if (response.user) {
        setUser(response.user);
      }
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.forgotPassword({ email });
      return { resetToken: response.resetToken };
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const verifyResetOtp = useCallback(async (email: string, otp: string, resetToken: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.verifyResetOtp({ email, otp, resetToken });
      return { verificationToken: response.verificationToken };
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const resetPassword = useCallback(async (email: string, newPassword: string, verificationToken: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.resetPassword({ email, newPassword, verificationToken });
      if (response.user) {
        setUser(response.user);
      }
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    verifyOtp,
    forgotPassword,
    verifyResetOtp,  
    resetPassword,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
