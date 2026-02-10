import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { handymanService, orderService } from '@fix-it/api';

export const useCategories = () => {
  return useQuery(['categories'], async () => {
    const res = await (await fetch('https://api.example.local/categories')).json();
    return res;
  });
};

export const useHandymen = (filters?: any) => {
  return useQuery(['handymen', filters], () => handymanService.getHandymen(filters));
};

export const useHandyman = (id: string) => {
  return useQuery(['handyman', id], () => handymanService.getHandymanById(id));
};

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation((data: any) => orderService.createOrder(data), {
    onSuccess: () => qc.invalidateQueries(['orders']),
  });
};

export const useOrders = (filters?: any) => {
  return useQuery(['orders', filters], () => orderService.getOrders(filters));
};
