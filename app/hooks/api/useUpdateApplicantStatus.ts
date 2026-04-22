import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { ApplicationStatus } from "~/types/application";

interface UpdateApplicantStatusPayload {
  status: Exclude<ApplicationStatus, "PENDING">;
  rejectionReason?: string;
}

const useUpdateApplicantStatus = (applicationId: number, jobId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateApplicantStatusPayload) => {
      const { data } = await axiosInstance.patch(
        `/admin/applicants/${applicationId}/status`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Status pelamar berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["applicants", jobId] });
      queryClient.invalidateQueries({ queryKey: ["applicant", applicationId] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Gagal memperbarui status pelamar.",
      );
    },
  });
};

export default useUpdateApplicantStatus;
