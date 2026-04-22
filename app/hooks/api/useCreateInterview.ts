import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";

interface CreateInterviewPayload {
  applicationId: number;
  interviewDate: string;
  locationLink?: string;
}

const useCreateInterview = (jobId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateInterviewPayload) => {
      const { data } = await axiosInstance.post("/admin/interviews", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Jadwal interview berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: ["interviews", jobId] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Gagal membuat jadwal interview.",
      );
    },
  });
};

export default useCreateInterview;
