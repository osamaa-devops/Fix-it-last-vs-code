import { apiClient } from "./client";
import type { User, AuthResponse, LoginRequest, RegisterRequest } from "@fix-it/types";

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post<AuthResponse>("/auth/refresh");
    return response.data;
  },

  resetPassword: async (email: string) => {
    await apiClient.post("/auth/reset-password", { email });
  },

  confirmResetPassword: async (token: string, newPassword: string) => {
    await apiClient.post("/auth/confirm-reset-password", { token, newPassword });
  },
};
