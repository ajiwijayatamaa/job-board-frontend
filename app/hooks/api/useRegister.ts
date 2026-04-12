import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { RegisterSchema } from "~/schema/register";

const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: RegisterSchema) => {
      const { data } = await axiosInstance.post("/auth/register", payload);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Registration Successful!");
      navigate("/login");
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Registration Failed";
      toast.error(errorMsg);
    },
  });
};

export default useRegister;
