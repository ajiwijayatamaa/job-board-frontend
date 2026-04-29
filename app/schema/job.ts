import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(1, "Job title tidak boleh kosong"),
  description: z.string().min(1, "Deskripsi tidak boleh kosong"),
  category: z.string().min(1, "Kategori tidak boleh kosong"),
  city: z.string().min(1, "Kota tidak boleh kosong"),
  deadline: z.string().min(1, "Deadline tidak boleh kosong"),
  tags: z
    .array(z.string().min(1, "Tag tidak boleh kosong"))
    .min(1, "Minimal 1 tag"),
  salary: z.number().min(0, "Salary tidak boleh negatif").optional(),
  banner: z
    .instanceof(File)
    .refine((f) => f.size <= 2 * 1024 * 1024, "Banner maksimal 2MB")
    .refine(
      (f) => ["image/jpeg", "image/png", "image/jpg"].includes(f.type),
      "Format hanya .jpg, .jpeg, .png",
    )
    .optional(),
});

export const updateJobSchema = createJobSchema.partial();

export type CreateJobSchema = z.infer<typeof createJobSchema>;
export type UpdateJobSchema = z.infer<typeof updateJobSchema>;
