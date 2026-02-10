import { apiClient } from "./client";
import type { Handyman, HandymanFilters, Rating } from "@fix-it/types";

export const handymanService = {
  getHandymen: async (filters?: HandymanFilters) => {
    const response = await apiClient.get<Handyman[]>("/handymen", { params: filters });
    return response.data;
  },

  getHandymanById: async (handymanId: string) => {
    const response = await apiClient.get<Handyman>(`/handymen/${handymanId}`);
    return response.data;
  },

  getHandymanRatings: async (handymanId: string) => {
    const response = await apiClient.get<Rating[]>(`/handymen/${handymanId}/ratings`);
    return response.data;
  },

  rateHandyman: async (handymanId: string, rating: number, review: string) => {
    const response = await apiClient.post<Rating>(`/handymen/${handymanId}/ratings`, {
      rating,
      review,
    });
    return response.data;
  },

  updateHandymanProfile: async (handymanId: string, data: Partial<Handyman>) => {
    const response = await apiClient.put<Handyman>(`/handymen/${handymanId}`, data);
    return response.data;
  },
};
