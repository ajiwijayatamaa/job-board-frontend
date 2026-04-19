import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";

const useDeleteTest = (testId: number, jobId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete(
        `/pre-selection-tests/${testId}`,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Pre-selection test berhasil dihapus.");
      queryClient.invalidateQueries({
        queryKey: ["pre-selection-test", "job", jobId],
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Gagal menghapus test. Coba lagi.",
      );
    },
  });
};

export default useDeleteTest;
