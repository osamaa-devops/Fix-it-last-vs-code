import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import {
  Category,
  Handyman,
  ServiceRequest,
  PaginatedResponseSchema,
  HandymanSchema,
} from '@/types/customer';
import {
  getCategories,
  getHandymen,
  getHandymanById,
  getServiceRequests,
  createServiceRequest,
  updateServiceRequest,
} from '@/lib/mock-data';

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getCategories();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Handymen List with Pagination
export function useHandymen(page: number = 1, limit: number = 10, category: string = '') {
  return useQuery({
    queryKey: ['handymen', page, limit, category],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return getHandymen(page, limit, category);
    },
    staleTime: 1000 * 60 * 10,
  });
}

// Single Handyman Profile
export function useHandymanProfile(id: string | undefined) {
  return useQuery({
    queryKey: ['handyman', id],
    queryFn: async () => {
      if (!id) return null;
      await new Promise((resolve) => setTimeout(resolve, 500));
      const handyman = getHandymanById(id);
      if (!handyman) throw new Error('Handyman not found');
      return handyman;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15,
  });
}

// Service Requests with Pagination
export function useServiceRequests(page: number = 1, limit: number = 10) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['service-requests', user?.id, page, limit],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getServiceRequests(user.id, page, limit);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });
}

// Create Service Request
export function useCreateServiceRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: {
      handymanId: string;
      category: string;
      title: string;
      description: string;
      scheduledDate: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      await new Promise((resolve) => setTimeout(resolve, 800));
      return createServiceRequest({
        ...data,
        customerId: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      router.push('/customer/orders');
    },
  });
}

// Update Service Request
export function useUpdateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ServiceRequest>;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updated = updateServiceRequest(id, data);
      if (!updated) throw new Error('Request not found');
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
    },
  });
}
