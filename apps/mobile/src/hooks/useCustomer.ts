import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { Category, Handyman, ServiceRequest, PaginatedResponse } from '@/types/customer';
import {
  getCategories,
  getHandymen,
  getHandymanById,
  getServiceRequests,
  createServiceRequest,
  updateServiceRequest,
} from '@/services/customerService';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
  });
}

export function useHandymen(page: number = 1, limit: number = 10, category: string = '') {
  return useQuery({
    queryKey: ['handymen', page, limit, category],
    queryFn: () => getHandymen(page, limit, category),
    staleTime: 1000 * 60 * 10,
  });
}

export function useHandymanProfile(id: string | undefined) {
  return useQuery({
    queryKey: ['handyman', id],
    queryFn: async () => {
      if (!id) return null;
      const handyman = await getHandymanById(id);
      if (!handyman) throw new Error('Handyman not found');
      return handyman;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15,
  });
}

export function useServiceRequests(page: number = 1, limit: number = 10) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['service-requests', user?.id, page, limit],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      return getServiceRequests(user.id, page, limit);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateServiceRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      handymanId: string;
      category: string;
      title: string;
      description: string;
      scheduledDate: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      return createServiceRequest({
        ...data,
        customerId: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
    },
  });
}

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
      const updated = await updateServiceRequest(id, data);
      if (!updated) throw new Error('Request not found');
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
    },
  });
}
