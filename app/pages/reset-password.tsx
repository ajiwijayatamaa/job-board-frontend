import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import { resetPasswordSchema, type ResetPasswordSchema } from "~/schema/auth";
import { axiosInstance } from "~/lib/axios";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token || "" }
  });

  useEffect(() => {
    if (token) setValue("token", token);
  }, [token, setValue]);

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      const { confirmPassword, ...payload } = data;
      await axiosInstance.post("/auth/reset-password", payload);
      toast.success("Kata sandi berhasil diperbarui. Silakan login kembali.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengatur ulang kata sandi.");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive font-semibold">Token tidak valid atau hilang.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 card-shadow">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Atur Ulang Kata Sandi</h1>
          <p className="mb-6 text-sm text-muted-foreground">Masukkan kata sandi baru Anda di bawah ini.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Kata Sandi Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  className="pl-10 pr-10" 
                  {...register("password")} 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Konfirmasi Kata Sandi</Label>
              <Input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simpan Kata Sandi Baru
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;