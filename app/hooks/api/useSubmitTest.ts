import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { SubmitTestSchema } from "~/schema/pre-selection-test";
import type { SubmitTestResponse } from "~/types/pre-selection-test";

const useSubmitTest = (jobId: number) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SubmitTestSchema) => {
      const { data: response } = await axiosInstance.post<SubmitTestResponse>(
        "/pre-selection-tests/submit",
        data,
      );
      return response;
    },
    onSuccess: (result) => {
      navigate(`/jobs/${jobId}/test-result`, {
        state: {
          score: result.score,
          isPassed: result.isPassed,
          passingScore: result.passingScore,
          testResultId: result.testResultId,
          jobId,
        },
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Gagal mengirim jawaban. Coba lagi.",
      );
    },
  });
};

export default useSubmitTest;
