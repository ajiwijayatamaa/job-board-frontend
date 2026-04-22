import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { ApplicationDetail } from "~/types/application";

const useGetApplicantById = (id: number) => {
  return useQuery({
    queryKey: ["applicant", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApplicationDetail>(
        `/admin/applicants/${id}`,
      );
      return data;
    },
    enabled: !!id,
  });
};

export default useGetApplicantById;
