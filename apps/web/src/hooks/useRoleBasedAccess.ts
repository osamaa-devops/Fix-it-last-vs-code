'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

type AllowedRole = 'customer' | 'handyman' | 'admin';

export function useRoleBasedAccess(allowedRoles: AllowedRole[]) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!allowedRoles.includes(user.userType as AllowedRole)) {
      router.push('/unauthorized');
      return;
    }
  }, [user, isLoading, router, allowedRoles]);

  return { isAuthorized: !!user && allowedRoles.includes(user.userType as AllowedRole), isLoading };
}

export function useCustomerOnly() {
  return useRoleBasedAccess(['customer']);
}

export function useHandymanOnly() {
  return useRoleBasedAccess(['handyman']);
}

export function useAdminOnly() {
  return useRoleBasedAccess(['admin']);
}
