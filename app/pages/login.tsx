import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, Briefcase } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Navbar from "~/components/layout/navbar";
import { toast } from "sonner";
import { loginSchema, type LoginSchema } from "~/schema/auth";
import { axiosInstance } from "~/lib/axios";
import { useAuth } from "~/stores/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login: setAuth, user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) navigate(user.role === "ADMIN" ? "/admin" : "/");
  }, [user]);

  const handleLogin = async (data: LoginSchema) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        ...data,
        role,
      });

      setAuth(res.data.data);
      toast.success("Login berhasil!");
      navigate(res.data.data.role === "ADMIN" ? "/admin" : "/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const res = await axiosInstance.post("/auth/google", {
        token: credentialResponse.credential,
        role,
      });

      setAuth(res.data.data);
      toast.success("Login Google berhasil!");
      navigate(res.data.data.role === "ADMIN" ? "/admin" : "/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Google login failed.");
    }
  };

  const renderForm = (emailPlaceholder: string, buttonText: string) => (
    <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-4">
      {/* EMAIL */}
      <div className="space-y-1.5 w-full text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Email
        </p>

        <div className="relative w-full">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

          <Input
            type="email"
            placeholder={emailPlaceholder}
            className="pl-10 w-full h-11 rounded-xl border-[#D1DFF0] bg-[#F4F8FF] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] text-[#0F2342] placeholder:text-slate-300 text-sm"
            {...register("email")}
          />
        </div>

        {errors.email && (
          <p className="text-xs text-rose-500 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="space-y-1.5 w-full text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Password
        </p>

        <div className="relative w-full">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan kata sandi"
            className="pl-10 pr-10 w-full h-11 rounded-xl border-[#D1DFF0] bg-[#F4F8FF] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] text-[#0F2342] placeholder:text-slate-300 text-sm"
            {...register("password")}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1D5FAD] transition-colors"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {errors.password && (
          <p className="text-xs text-rose-500 font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* FORGOT */}
      <div className="flex justify-end -mt-1">
        <Link
          to="/forgot-password"
          className="text-xs font-medium text-[#1D5FAD] hover:text-[#174E8F] transition-colors"
        >
          Lupa Kata Sandi?
        </Link>
      </div>

      {/* BUTTON */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 rounded-xl bg-[#1D5FAD] hover:bg-[#174E8F] text-white font-semibold text-sm shadow-md shadow-[#1D5FAD]/20"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sedang Masuk...
          </div>
        ) : (
          buttonText
        )}
      </Button>

      {/* DIVIDER */}
      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-[#E2EAF4]" />
        <span className="text-[11px] font-semibold text-slate-400">ATAU</span>
        <div className="h-px flex-1 bg-[#E2EAF4]" />
      </div>

      {/* GOOGLE */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => toast.error("Login Google Gagal")}
        />
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#F0F5FB]">
      <Navbar />

      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#1D5FAD] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#1D5FAD]/20">
              <Briefcase className="w-7 h-7 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-[#0F2342]">
              Selamat Datang
            </h1>

            <p className="mt-1 text-sm text-slate-400 font-medium">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white border border-[#E2EAF4] rounded-2xl overflow-hidden shadow-sm">
            <Tabs
              defaultValue="user"
              className="flex flex-col w-full"
              onValueChange={(value) =>
                setRole(value === "company" ? "ADMIN" : "USER")
              }
            >
              {/* TAB HEADER */}
              <div className="border-b border-[#E2EAF4] bg-[#F4F8FF] px-4 py-4 pt-4 pb-4">
                <TabsList className="grid grid-cols-2 w-full bg-white border border-[#E2EAF4] rounded-xl p-1 gap-1 h-auto">
                  <TabsTrigger
                    value="user"
                    className="h-8 rounded-lg text-sm font-semibold justify-center data-[state=active]:bg-[#1D5FAD] data-[state=active]:text-white text-slate-500"
                  >
                    Pencari Kerja
                  </TabsTrigger>

                  <TabsTrigger
                    value="company"
                    className="h-8 rounded-lg text-sm font-semibold justify-center data-[state=active]:bg-[#1D5FAD] data-[state=active]:text-white text-slate-500"
                  >
                    Perusahaan
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* USER */}
              <TabsContent value="user" className="mt-0 px-6 py-6">
                {renderForm("anda@contoh.com", "Masuk")}
              </TabsContent>

              {/* COMPANY */}
              <TabsContent value="company" className="mt-0 px-6 py-6">
                {renderForm("hr@perusahaan.com", "Masuk sebagai Perusahaan")}
              </TabsContent>
            </Tabs>

            {/* FOOTER */}
            <div className="px-6 pb-6 text-center">
              <div className="h-px bg-[#E2EAF4] mb-4" />

              <p className="text-sm text-slate-400">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-[#1D5FAD] hover:text-[#174E8F] transition-colors"
                >
                  Daftar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
