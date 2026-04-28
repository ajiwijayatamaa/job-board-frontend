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
} from "lucide-react";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";
import Navbar from "~/components/layout/navbar";

import { toast } from "sonner";
import { registerSchema, type RegisterSchema } from "~/schema/auth";
import { axiosInstance } from "~/lib/axios";

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
        res.data.message || "Pendaftaran berhasil! Silakan cek email Anda."
      );

      navigate("/verify-email", { state: { email: payload.email } });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Registration failed."
      );
    }
  };

  const renderInput = (
    label: string,
    name: keyof RegisterSchema,
    placeholder: string,
    Icon: any,
    type: string = "text"
  ) => (
    <div className="space-y-2 w-full text-left">
      <Label>{label}</Label>
      <div className="relative w-full">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type={type}
          placeholder={placeholder}
          className="pl-10 w-full h-10 md:h-11"
          {...register(name)}
        />
      </div>
      {errors[name] && (
        <p className="text-xs text-destructive">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );

  const renderPassword = () => (
    <div className="space-y-2 w-full text-left">
      <Label>Password</Label>
      <div className="relative w-full">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Minimal 8 karakter"
          className="pl-10 pr-10 w-full h-10 md:h-11"
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {errors.password && (
        <p className="text-xs text-destructive">
          {errors.password.message}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 md:p-8 shadow-sm">

          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold">
              Buat Akun
            </h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Bergabunglah dengan komunitas kami sekarang
            </p>
          </div>

          {/* TABS */}
          <Tabs
            defaultValue="user"
            className="w-full mt-6"
            onValueChange={(v) =>
              setValue("role", v === "user" ? "USER" : "ADMIN")
            }
          >
            {/* TAB SWITCH */}
            <TabsList className="grid grid-cols-2 w-full max-w-xs mx-auto mb-6 bg-muted/50 p-1 h-10 md:h-11 rounded-lg">
              <TabsTrigger value="user">Pencari Kerja</TabsTrigger>
              <TabsTrigger value="company">Perusahaan</TabsTrigger>
            </TabsList>

            {/* USER FORM */}
            <TabsContent value="user" className="mt-0 w-full">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-4"
              >
                {renderInput("Nama Lengkap", "fullName", "Budi Santoso", User)}
                {renderInput("Email", "email", "anda@contoh.com", Mail, "email")}
                {renderInput("Nomor Telepon", "phone", "08123456789", Phone)}

                {renderPassword()}

                {renderInput(
                  "Konfirmasi Kata Sandi",
                  "confirmPassword",
                  "Ulangi kata sandi",
                  Lock,
                  "password"
                )}

                <Button
                  type="submit"
                  className="w-full h-10 md:h-11"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sedang Membuat Akun..." : "Buat Akun"}
                </Button>
              </form>
            </TabsContent>

            {/* COMPANY FORM */}
            <TabsContent value="company" className="mt-0 w-full">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-4"
              >
                {renderInput("Nama Perusahaan", "companyName", "PT Maju Jaya", Building2)}
                {renderInput("Nama Admin", "fullName", "Nama Admin", User)}
                {renderInput("Email", "email", "hr@perusahaan.com", Mail, "email")}
                {renderInput("Telepon Perusahaan", "phone", "08123456789", Phone)}

                {renderPassword()}

                {renderInput(
                  "Konfirmasi Kata Sandi",
                  "confirmPassword",
                  "Ulangi kata sandi",
                  Lock,
                  "password"
                )}

                <Button
                  type="submit"
                  className="w-full h-10 md:h-11"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sedang Mendaftar..." : "Daftar Perusahaan"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* FOOTER */}
          <p className="mt-6 text-center text-xs md:text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;