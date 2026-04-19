import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { TestResult } from "~/types/pre-selection-test";
import type { PageableResponse, PaginationQueries } from "~/types/pagination";

interface GetTestResultsQuery extends PaginationQueries {
  search?: string;
}

const useGetTestResults = (
  testId: number,
  queryParams: GetTestResultsQuery,
) => {
  return useQuery({
    queryKey: ["test-results", testId, queryParams],
    queryFn: async () => {
      const { data } = await axiosInstance<PageableResponse<TestResult>>(
        `/pre-selection-tests/${testId}/results`,
        { params: queryParams },
      );
      return data;
    },
    enabled: !!testId,
  });
};

export default useGetTestResults;
