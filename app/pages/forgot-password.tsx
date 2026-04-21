import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "~/schema/auth";
import { axiosInstance } from "~/lib/axios";
import { toast } from "sonner";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      await axiosInstance.post("/auth/forgot-password", data);
      toast.success("Instruksi atur ulang kata sandi telah dikirim ke email Anda.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 card-shadow">
          <div className="mb-6">
            <Link to="/login" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Login
            </Link>
          </div>
          
          <h1 className="mb-2 text-2xl font-bold text-foreground">Lupa Kata Sandi?</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="nama@email.com" 
                  className="pl-10" 
                  {...register("email")} 
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Kirim Tautan Reset
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;