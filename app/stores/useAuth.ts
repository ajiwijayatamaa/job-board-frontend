import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "~/lib/axios";

//apa yang ingin di simpan di global state
export type UserAuth = {
  id: number;
  name: string;
  email: string;
  role: string;
  provider: string;
  referralCode: string;
  referredBy: number | null;
  profilePicture: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  points: number;
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
        await axiosInstance.post("/auth/logout");
        set({ user: null });
        window.location.href = "/";
      },
    }),
    { name: "user-auth-storage" },
  ),
);
