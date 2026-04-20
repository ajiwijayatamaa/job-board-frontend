import * as z from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  // Email tidak diedit melalui form ini, jadi tidak disertakan dalam skema update.
  // Jika ingin diedit, perlu endpoint terpisah dan validasi email unik.
  phone: z.string().optional(), // Opsional, karena mungkin tidak semua user/role punya
  dateOfBirth: z.string().optional(), // Format YYYY-MM-DD, bisa kosong
  gender: z.string().optional(),
  education: z.enum(["high_school", "diploma", "bachelor", "master", "doctorate"], {
  }).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  // companyName hanya relevan untuk role ADMIN.
  // Keberadaan field ini akan ditangani di form logic dan validasi DTO backend.
  companyName: z.string().optional(),
  // Field lain seperti description, companyAddress, latitude, longitude tidak ada di form saat ini.
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;