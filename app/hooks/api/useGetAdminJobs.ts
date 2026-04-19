import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { Job } from "~/types/job";
import type { PageableResponse, PaginationQueries } from "~/types/pagination";

interface GetAdminJobsQuery extends PaginationQueries {
  search?: string;
  category?: string;
  city?: string;
}

const useGetAdminJobs = (queryParams: GetAdminJobsQuery) => {
  return useQuery({
    queryKey: ["admin-jobs", queryParams],
    queryFn: async () => {
      const { data } = await axiosInstance<PageableResponse<Job>>(
        "/admin/jobs",
        { params: queryParams },
      );
      return data;
    },
  });
};

export default useGetAdminJobs;
