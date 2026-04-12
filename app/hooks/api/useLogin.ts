import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import { useAuth } from "~/stores/useAuth";
import type { LoginSchema } from "~/schema/login";

const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (payload: LoginSchema) => {
      const { data } = await axiosInstance.post("/auth/login", payload);
      return data;
    },
    onSuccess: (data) => {
      login(data); // Simpan session ke Zustand/Store
      toast.success("Login Successful!");
      navigate("/");
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Login Failed";
      toast.error(errorMsg);
    },
  });
};

export default useLogin;
