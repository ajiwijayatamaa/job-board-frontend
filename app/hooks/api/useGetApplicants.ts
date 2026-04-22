import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { Application } from "~/types/application";
import type { PageableResponse } from "~/types/pagination";

interface GetApplicantsQuery {
  page?: number;
  take?: number;
  search?: string;
  minAge?: number;
  maxAge?: number;
  minExpectedSalary?: number;
  maxExpectedSalary?: number;
  education?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const useGetApplicants = (jobId: number, query: GetApplicantsQuery) => {
  return useQuery({
    queryKey: ["applicants", jobId, query],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Application>>(
        `/admin/applicants/job/${jobId}`,
        { params: query },
      );
      return data;
    },
    enabled: !!jobId,
  });
};

export default useGetApplicants;
