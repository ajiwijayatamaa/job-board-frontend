import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi diperlukan"),
    role: z.enum(["USER", "ADMIN"], { message: "Silakan pilih peran Anda" }),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  })
  .refine((data) => (data.role === "ADMIN" ? !!data.companyName : true), {
    message: "Nama perusahaan wajib diisi untuk Admin",
    path: ["companyName"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi diperlukan"),
    token: z.string().min(1, "Token tidak valid"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;