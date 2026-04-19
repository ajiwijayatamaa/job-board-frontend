import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { JobStatus } from "~/types/job";

const useUpdateJobStatus = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: JobStatus) => {
      const { data } = await axiosInstance.patch(`/admin/jobs/${id}/status`, {
        status,
      });
      return data;
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-job", id] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Gagal mengubah status.");
    },
  });
};

export default useUpdateJobStatus;
