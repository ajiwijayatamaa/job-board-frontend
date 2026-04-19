import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { UpdateJobSchema } from "~/schema/job";

const useUpdateJob = (id: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: UpdateJobSchema) => {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.category) formData.append("category", data.category);
      if (data.city) formData.append("city", data.city);
      if (data.deadline) formData.append("deadline", data.deadline);
      if (data.tags) formData.append("tags", JSON.stringify(data.tags));
      if (data.salary) formData.append("salary", data.salary.toString());
      if (data.banner) formData.append("banner", data.banner);

      const { data: response } = await axiosInstance.patch(
        `/admin/jobs/${id}`,
        formData,
      );
      return response;
    },
    onSuccess: () => {
      toast.success("Lowongan berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-job", id] });
      navigate(`/admin/jobs/${id}`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Gagal memperbarui lowongan.",
      );
    },
  });
};

export default useUpdateJob;
