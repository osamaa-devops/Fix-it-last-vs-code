import { apiClient } from "./client";
import type { User, UpdateProfileRequest } from "@fix-it/types";

export const userService = {
  getProfile: async (userId: string) => {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (userId: string, data: UpdateProfileRequest) => {
    const response = await apiClient.put<User>(`/users/${userId}`, data);
    return response.data;
  },

  uploadAvatar: async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await apiClient.post<User>(`/users/${userId}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteAccount: async (userId: string) => {
    await apiClient.delete(`/users/${userId}`);
  },
};
