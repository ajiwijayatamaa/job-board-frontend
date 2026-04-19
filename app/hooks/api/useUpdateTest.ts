import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { UpdatePreSelectionTestSchema } from "~/schema/pre-selection-test";

const useUpdateTest = (testId: number, jobId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePreSelectionTestSchema) => {
      const { data: response } = await axiosInstance.patch(
        `/pre-selection-tests/${testId}`,
        data,
      );
      return response;
    },
    onSuccess: () => {
      toast.success("Pre-selection test berhasil diperbarui!");
      queryClient.invalidateQueries({
        queryKey: ["pre-selection-test", "job", jobId],
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Gagal memperbarui test. Coba lagi.",
      );
    },
  });
};

export default useUpdateTest;
