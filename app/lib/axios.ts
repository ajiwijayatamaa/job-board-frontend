import axios from "axios";
import { useAuth } from "~/stores/useAuth";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API || "http://localhost:8000",
  withCredentials: true,
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbjNAbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzY1OTY1MjgsImV4cCI6MTc3NjU5OTIyOH0.zg-tGPU_yP873MO0KvAS269V17npfNPaOVDAzDFz-Qo`,
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
