import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";

interface UpdateInterviewPayload {
  interviewDate?: string;
  locationLink?: string;
}

const useUpdateInterview = (interviewId: number, jobId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateInterviewPayload) => {
      const { data } = await axiosInstance.patch(
        `/admin/interviews/${interviewId}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Jadwal interview berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["interviews", jobId] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Gagal memperbarui jadwal interview.",
      );
    },
  });
};

export default useUpdateInterview;
