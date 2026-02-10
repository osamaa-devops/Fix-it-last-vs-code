import { apiClient } from "../client.js";
import type { Category, Service, ServiceFilters } from "@fix-it/types";

export const serviceService = {
  getCategories: async () => {
    const response = await apiClient.get<Category[]>("/services/categories");
    return response.data;
  },

  getServices: async (filters?: ServiceFilters) => {
    const response = await apiClient.get<Service[]>("/services", { params: filters });
    return response.data;
  },

  getServiceById: async (serviceId: string) => {
    const response = await apiClient.get<Service>(`/services/${serviceId}`);
    return response.data;
  },

  searchServices: async (query: string) => {
    const response = await apiClient.get<Service[]>("/services/search", {
      params: { q: query },
    });
    return response.data;
  },
};
