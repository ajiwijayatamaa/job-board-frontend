import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { PreSelectionTest } from "~/types/pre-selection-test";

const useGetTestByJobId = (jobId: number) => {
  return useQuery({
    queryKey: ["pre-selection-test", "job", jobId],
    queryFn: async () => {
      const { data } = await axiosInstance<PreSelectionTest>(
        `/pre-selection-tests/job/${jobId}`,
      );
      return data;
    },
    enabled: !!jobId,
    retry: false,
  });
};

export default useGetTestByJobId;
