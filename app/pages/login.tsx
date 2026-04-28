import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
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
          "Login failed. Please check your credentials."
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
      toast.error(
        error.response?.data?.message || "Google login failed."
      );
    }
  };

  const renderForm = (emailPlaceholder: string, buttonText: string) => (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="w-full space-y-4 md:space-y-5"
    >
      {/* EMAIL */}
      <div className="space-y-2">
        <Label>Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder={emailPlaceholder}
            className="pl-10 h-10 md:h-11"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="space-y-2">
        <Label>Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan kata sandi"
            className="pl-10 pr-10 h-10 md:h-11"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* FORGOT PASSWORD */}
      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          className="text-xs md:text-sm text-primary hover:underline"
        >
          Lupa Kata Sandi?
        </Link>
      </div>

      {/* BUTTON */}
      <Button
        type="submit"
        className="w-full h-10 md:h-11"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sedang Masuk..." : buttonText}
      </Button>

      {/* DIVIDER */}
      <div className="flex items-center gap-2 my-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">ATAU</span>
        <div className="flex-1 h-px bg-border" />
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container flex items-center justify-center px-4 py-10 md:py-16">
        <div className="w-full max-w-md mx-auto rounded-xl border border-border bg-card p-5 md:p-8 shadow-sm flex flex-col items-center">

          {/* HEADER */}
          <div className="text-center w-full">
            <h1 className="text-xl md:text-2xl font-bold">
              Selamat Datang Kembali
            </h1>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              Masuk ke akun Anda
            </p>
          </div>

          {/* TABS */}
          <Tabs
            defaultValue="user"
            className="w-full mt-6"
            onValueChange={(value) =>
              setRole(value === "company" ? "ADMIN" : "USER")
            }
          >
            {/* TAB SWITCH */}
            <TabsList className="grid grid-cols-2 w-full max-w-xs mx-auto mb-6 bg-muted/50 p-1 h-10 md:h-11 rounded-lg">
              <TabsTrigger value="user">Pencari Kerja</TabsTrigger>
              <TabsTrigger value="company">Perusahaan</TabsTrigger>
            </TabsList>

            {/* FORM */}
            <TabsContent value="user" className="mt-0">
              {renderForm("anda@contoh.com", "Masuk")}
            </TabsContent>

            <TabsContent value="company" className="mt-0">
              {renderForm("hr@perusahaan.com", "Masuk sebagai Perusahaan")}
            </TabsContent>
          </Tabs>

          {/* FOOTER */}
          <p className="mt-6 text-center text-xs md:text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;