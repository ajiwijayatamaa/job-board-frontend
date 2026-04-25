import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { AnalyticsSalaryTrends } from "~/types/analytics";

interface SalaryTrendsQuery {
  startDate?: string;
  endDate?: string;
}

const useGetSalaryTrends = (query?: SalaryTrendsQuery) => {
  return useQuery({
    queryKey: ["analytics-salary-trends", query],
    queryFn: async () => {
      const { data } = await axiosInstance.get<AnalyticsSalaryTrends>(
        "/admin/analytics/salary-trends",
        { params: query },
      );
      return data;
    },
  });
};

export default useGetSalaryTrends;
