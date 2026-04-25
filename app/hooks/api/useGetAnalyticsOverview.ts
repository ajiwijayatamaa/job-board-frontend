import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { AnalyticsOverview } from "~/types/analytics";

const useGetAnalyticsOverview = () => {
  return useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<AnalyticsOverview>(
        "/admin/analytics/overview",
      );
      return data;
    },
  });
};

export default useGetAnalyticsOverview;
