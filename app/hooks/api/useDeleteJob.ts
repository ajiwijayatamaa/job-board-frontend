import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";

const useDeleteJob = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/admin/jobs/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Lowongan berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      navigate("/admin/jobs");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Gagal menghapus lowongan.");
    },
  });
};

export default useDeleteJob;
