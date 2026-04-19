import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { CreatePreSelectionTestSchema } from "~/schema/pre-selection-test";

const useCreateTest = (jobId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePreSelectionTestSchema) => {
      const { data: response } = await axiosInstance.post(
        "/pre-selection-tests",
        data,
      );
      return response;
    },
    onSuccess: () => {
      toast.success("Pre-selection test berhasil dibuat!");
      queryClient.invalidateQueries({
        queryKey: ["pre-selection-test", "job", jobId],
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Gagal membuat test. Coba lagi.",
      );
    },
  });
};

export default useCreateTest;
