import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";

const useDeleteInterview = (jobId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interviewId: number) => {
      const { data } = await axiosInstance.delete(
        `/admin/interviews/${interviewId}`,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Jadwal interview berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["interviews", jobId] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Gagal menghapus jadwal interview.",
      );
    },
  });
};

export default useDeleteInterview;
