import { apiClient } from "./client";
import type { Order, CreateOrderRequest, OrderFilters } from "@fix-it/types";

export const orderService = {
  createOrder: async (data: CreateOrderRequest) => {
    const response = await apiClient.post<Order>("/orders", data);
    return response.data;
  },

  getOrders: async (filters?: OrderFilters) => {
    const response = await apiClient.get<Order[]>("/orders", { params: filters });
    return response.data;
  },

  getOrderById: async (orderId: string) => {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
  },

  updateOrder: async (orderId: string, data: Partial<Order>) => {
    const response = await apiClient.put<Order>(`/orders/${orderId}`, data);
    return response.data;
  },

  cancelOrder: async (orderId: string, reason: string) => {
    const response = await apiClient.post<Order>(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  completeOrder: async (orderId: string) => {
    const response = await apiClient.post<Order>(`/orders/${orderId}/complete`, {});
    return response.data;
  },
};
