import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "~/lib/axios";

//apa yang ingin di simpan di global state
export type UserAuth = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  provider: string;
  profilePhoto: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type Store = {
  user: UserAuth | null;
  login: (payload: UserAuth) => void;
  logout: () => Promise<void>;
};

export const useAuth = create<Store>()(
  persist(
    (set) => ({
      user: null,
      login: (payload) => set(() => ({ user: payload })),
      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
        } catch (error) {
          console.error("Logout request failed:", error);
        } finally {
          set({ user: null });
          window.location.href = "/";
        }
      },
    }),
    { name: "user-auth-storage" },
  ),
);
