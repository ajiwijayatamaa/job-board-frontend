import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { AnalyticsApplicantInterests } from "~/types/analytics";

interface ApplicantInterestsQuery {
  startDate?: string;
  endDate?: string;
}

const useGetApplicantInterests = (query?: ApplicantInterestsQuery) => {
  return useQuery({
    queryKey: ["analytics-applicant-interests", query],
    queryFn: async () => {
      const { data } = await axiosInstance.get<AnalyticsApplicantInterests>(
        "/admin/analytics/applicant-interests",
        { params: query },
      );
      return data;
    },
  });
};

export default useGetApplicantInterests;
