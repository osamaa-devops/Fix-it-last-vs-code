import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * API Client Factory
 * Creates configured axios instances for different API consumption patterns
 */

const getBaseURL = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
};

export const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
  return axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const apiClient = createApiClient();

/**
 * Global Axios interceptors for auth tokens, error handling, etc.
 */
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth token on unauthorized
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
      }
    }
    return Promise.reject(error);
  }
);
