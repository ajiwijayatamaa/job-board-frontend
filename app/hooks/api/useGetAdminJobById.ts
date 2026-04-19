import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { Job } from "~/types/job";

const useGetAdminJobById = (id: number) => {
  return useQuery({
    queryKey: ["admin-job", id],
    queryFn: async () => {
      const { data } = await axiosInstance<Job>(`/admin/jobs/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export default useGetAdminJobById;
