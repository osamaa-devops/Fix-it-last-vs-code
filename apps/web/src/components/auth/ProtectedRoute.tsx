'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * HOC to protect routes - redirects to login if not authenticated
 */
export function Protected({ children, fallback }: ProtectedProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login, passing current path as redirect
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

/**
 * HOC to redirect authenticated users away from auth pages
 */
export function ProtectedFromAuth({ children }: ProtectedProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect based on role
      if (user.role === 'HANDYMAN') {
        router.push('/handyman/dashboard');
      } else if (user.role === 'CUSTOMER') {
        router.push('/customer/dashboard');
      } else if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}

/**
 * Component to handle role-based redirects after login
 */
export function RoleBasedRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    if (!isLoading && user) {
      const targetPath = redirect || getRoleBasedPath(user.role);
      router.push(targetPath);
    }
  }, [user, isLoading, router, redirect]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return null;
}

function getRoleBasedPath(role: string): string {
  switch (role) {
    case 'HANDYMAN':
      return '/handyman/dashboard';
    case 'CUSTOMER':
      return '/customer/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute inset-1 bg-white rounded-full"></div>
      </div>
    </div>
  );
}
