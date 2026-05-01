import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Building2,
  Phone,
  Briefcase,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Navbar from "~/components/layout/navbar";
import { toast } from "sonner";
import { registerSchema, type RegisterSchema } from "~/schema/auth";
import { axiosInstance } from "~/lib/axios";
import { cn } from "~/lib/utils";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "USER" },
  });

  const onSubmit = async (values: RegisterSchema) => {
    try {
      const { confirmPassword, ...payload } = values;
      const res = await axiosInstance.post("/auth/register", payload);
      toast.success(
        res.data.message || "Pendaftaran berhasil! Silakan cek email Anda.",
      );
      navigate("/verify-email", { state: { email: payload.email } });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  const renderInput = (
    label: string,
    name: keyof RegisterSchema,
    placeholder: string,
    Icon: any,
    type: string = "text",
  ) => (
    <div className="space-y-1.5 w-full text-left">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="relative w-full">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type={type}
          placeholder={placeholder}
          className="pl-10 w-full h-11 rounded-xl border-[#D1DFF0] bg-[#F4F8FF] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] text-[#0F2342] placeholder:text-slate-300 text-sm"
          {...register(name)}
        />
      </div>
      {errors[name] && (
        <p className="text-xs text-rose-500 font-medium">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );

  const renderPassword = () => (
    <div className="space-y-1.5 w-full text-left">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Password
      </p>
      <div className="relative w-full">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Minimal 8 karakter"
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
  );

  return (
    <div className="min-h-screen bg-[#F0F5FB]">
      <Navbar />

      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Logo mark + title */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#1D5FAD] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#1D5FAD]/20">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F2342]">Buat Akun</h1>
            <p className="mt-1 text-sm text-slate-400 font-medium">
              Bergabunglah dengan komunitas kami sekarang
            </p>
          </div>

          {/* Card */}
          <div className="bg-white border border-[#E2EAF4] rounded-2xl overflow-hidden shadow-sm">
            {/* Tabs */}
            <Tabs
              defaultValue="user"
              className="w-full flex flex-col"
              onValueChange={(v) =>
                setValue("role", v === "user" ? "USER" : "ADMIN")
              }
            >
              {/* Tab Header */}
              <div className="border-b border-[#E2EAF4] bg-[#F4F8FF] px-4 py-4 pt-4 pb-4">
                <TabsList className="grid grid-cols-2 w-full bg-white border border-[#E2EAF4] rounded-xl p-1 gap-1 h-auto">
                  <TabsTrigger
                    value="user"
                    className="h-8 rounded-lg text-sm font-semibold data-[state=active]:bg-[#1D5FAD] data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-500 transition-all"
                  >
                    Pencari Kerja
                  </TabsTrigger>
                  <TabsTrigger
                    value="company"
                    className="h-8 rounded-lg text-sm font-semibold data-[state=active]:bg-[#1D5FAD] data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-500 transition-all"
                  >
                    Perusahaan
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* User Form */}
              <TabsContent value="user" className="mt-0 px-6 py-6">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  {renderInput(
                    "Nama Lengkap",
                    "fullName",
                    "Budi Santoso",
                    User,
                  )}
                  {renderInput(
                    "Email",
                    "email",
                    "anda@contoh.com",
                    Mail,
                    "email",
                  )}
                  {renderInput("Nomor Telepon", "phone", "08123456789", Phone)}
                  {renderPassword()}
                  {renderInput(
                    "Konfirmasi Kata Sandi",
                    "confirmPassword",
                    "Ulangi kata sandi",
                    Lock,
                    "password",
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-[#1D5FAD] hover:bg-[#174E8F] text-white font-semibold text-sm mt-2 shadow-md shadow-[#1D5FAD]/20"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sedang Membuat Akun...
                      </div>
                    ) : (
                      "Buat Akun"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Company Form */}
              <TabsContent value="company" className="mt-0 px-6 py-6">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  {renderInput(
                    "Nama Perusahaan",
                    "companyName",
                    "PT Maju Jaya",
                    Building2,
                  )}
                  {renderInput("Nama Admin", "fullName", "Nama Admin", User)}
                  {renderInput(
                    "Email",
                    "email",
                    "hr@perusahaan.com",
                    Mail,
                    "email",
                  )}
                  {renderInput(
                    "Telepon Perusahaan",
                    "phone",
                    "08123456789",
                    Phone,
                  )}
                  {renderPassword()}
                  {renderInput(
                    "Konfirmasi Kata Sandi",
                    "confirmPassword",
                    "Ulangi kata sandi",
                    Lock,
                    "password",
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-[#1D5FAD] hover:bg-[#174E8F] text-white font-semibold text-sm mt-2 shadow-md shadow-[#1D5FAD]/20"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sedang Mendaftar...
                      </div>
                    ) : (
                      "Daftar Perusahaan"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="px-6 pb-6 text-center">
              <div className="h-px bg-[#E2EAF4] mb-4" />
              <p className="text-sm text-slate-400">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#1D5FAD] hover:text-[#174E8F] transition-colors"
                >
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
