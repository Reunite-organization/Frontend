import axios from "axios";
import { apiBaseUrl } from "./apiConfig";

export const clearStoredAuth = () => {
  localStorage.removeItem("auth-token");
  localStorage.removeItem("refresh-token");
  localStorage.removeItem("user-data");
};

const instance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    const volunteerDeviceId =
      localStorage.getItem("reunite-volunteer-device-id") ||
      localStorage.getItem("deviceId");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (volunteerDeviceId) {
      config.headers["x-device-id"] = volunteerDeviceId;
    }

    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    const language = localStorage.getItem("falagiye-language") || "en";
    config.headers["Accept-Language"] = language;

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/auth/refresh-token"
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh-token");
        if (!refreshToken) {
          clearStoredAuth();
          if (typeof window !== "undefined") {
            window.location.assign("/auth/login");
          }
          return Promise.reject(error);
        }
        const response = await instance.post("/api/auth/refresh-token", {
          refreshToken,
        });
        const { token } = response.data.data;
        localStorage.setItem("auth-token", token);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        clearStoredAuth();
        if (typeof window !== "undefined") {
          window.location.assign("/auth/login");
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
