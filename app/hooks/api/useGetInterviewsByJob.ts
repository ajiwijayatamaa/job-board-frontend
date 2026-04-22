import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { Interview } from "~/types/interview";

const useGetInterviewsByJob = (jobId: number) => {
  return useQuery({
    queryKey: ["interviews", jobId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: Interview[] }>(
        `/admin/interviews/job/${jobId}`,
      );
      return data;
    },
    enabled: !!jobId,
  });
};

export default useGetInterviewsByJob;
