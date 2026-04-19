import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { CreateJobSchema } from "~/schema/job";

const useCreateJob = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: CreateJobSchema) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("city", data.city);
      formData.append("deadline", data.deadline);
      formData.append("tags", JSON.stringify(data.tags));
      if (data.salary) formData.append("salary", data.salary.toString());
      if (data.banner) formData.append("banner", data.banner);

      const { data: response } = await axiosInstance.post(
        "/admin/jobs",
        formData,
      );
      return response;
    },
    onSuccess: (result) => {
      toast.success("Lowongan berhasil dibuat!");
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      navigate(`/admin/jobs/${result.data.id}`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Gagal membuat lowongan.");
    },
  });
};

export default useCreateJob;
