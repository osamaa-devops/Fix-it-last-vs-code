import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

// API Base URL - change to your backend
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to headers
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');

        if (refreshToken) {
          // Call refresh endpoint to get new token
          // This is a mock - implement based on your backend
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;

          // Store new token
          await SecureStore.setItemAsync('auth_token', accessToken);

          // Retry original request
          originalRequest.headers!.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          // No refresh token available - redirect to login
          throw new Error('Session expired. Please login again.');
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('refresh_token');
        throw refreshError;
      }
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      });
    }

    // Handle other API errors
    const errorData = error.response?.data as any;
    return Promise.reject({
      message: errorData?.message || 'An error occurred',
      code: error.response?.status,
      data: errorData,
    });
  }
);

export default api;
