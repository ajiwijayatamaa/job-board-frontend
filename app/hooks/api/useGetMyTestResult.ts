import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { MyTestResultResponse } from "~/types/pre-selection-test";

const useGetMyTestResult = (jobId: number, enabled: boolean) => {
  return useQuery({
    queryKey: ["my-test-result", jobId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<MyTestResultResponse>(
        `/pre-selection-tests/my-result/${jobId}`,
      );
      return data;
    },
    enabled,
    retry: false, // jangan retry jika 404 (belum ikut tes)
  });
};

export default useGetMyTestResult;
