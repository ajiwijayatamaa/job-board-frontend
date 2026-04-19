import axios from "axios";
import { useAuth } from "~/stores/useAuth";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API || "http://localhost:8000",
  withCredentials: true,
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJwaWJvbGU3MTA1QHRhdGVmYXJtLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzc2NTkzMTA0LCJleHAiOjE3NzY1OTU4MDR9.YcL9xLZheWEBXYx7Y5mX-LAWsw0nEyIKQqTKYZ-_s4Q`,
  },
});

export const refreshInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API || "http://localhost:8000",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Token expired" &&
      !originalRequest._retry
    ) {
      try {
        await refreshInstance.post("/auth/refresh");
        return axiosInstance(originalRequest);
      } catch (error) {
        useAuth.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
