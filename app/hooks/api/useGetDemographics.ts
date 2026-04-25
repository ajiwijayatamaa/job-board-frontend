import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { AnalyticsDemographics } from "~/types/analytics";

interface DemographicsQuery {
  startDate?: string;
  endDate?: string;
}

const useGetDemographics = (query?: DemographicsQuery) => {
  return useQuery({
    queryKey: ["analytics-demographics", query],
    queryFn: async () => {
      const { data } = await axiosInstance.get<AnalyticsDemographics>(
        "/admin/analytics/demographics",
        { params: query },
      );
      return data;
    },
  });
};

export default useGetDemographics;
