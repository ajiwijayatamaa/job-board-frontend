import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { PreSelectionTestForUser } from "~/types/pre-selection-test";

const useTakeTest = (jobId: number) => {
  return useQuery({
    queryKey: ["take-test", jobId],
    queryFn: async () => {
      const { data } = await axiosInstance<PreSelectionTestForUser>(
        `/pre-selection-tests/take/${jobId}`,
      );
      return data;
    },
    enabled: !!jobId,
    staleTime: Infinity, // soal tidak perlu di-refetch selama sesi
    refetchOnWindowFocus: false,
  });
};

export default useTakeTest;
