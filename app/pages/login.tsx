import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Chrome,
  Loader2,
  Ticket,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import useLogin from "~/hooks/api/useLogin";
import { axiosInstance } from "~/lib/axios";
import { loginSchema, type LoginSchema } from "~/schema/login";
import { useAuth } from "~/stores/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: loginMutation, isPending } = useLogin();

  async function onSubmit(data: LoginSchema) {
    await loginMutation(data);
  }

  const handleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const response = await axiosInstance.post("/auth/google", {
          accessToken: access_token,
        });

        login(response.data);
        toast.success("Login Google Berhasil!");
        navigate("/");
      } catch (error) {
        toast.error("Login Google Gagal");
      }
    },
  });

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-6 selection:bg-orange-100 selection:text-orange-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px]"
      >
        {/* Logo Branding */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-xl shadow-orange-500/10 group-hover:scale-105 transition-transform">
              <Ticket className="h-6 w-6 text-orange-400 rotate-12" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-zinc-900 italic">
              EVENTIFIRE<span className="text-orange-500">.</span>
            </span>
          </Link>
        </div>

        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-300/50 border border-zinc-200">
          {/* ── TICKET TOP: Header ── */}
          <div className="bg-zinc-900 px-8 pt-10 pb-12 relative overflow-hidden text-center">
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                <span className="text-orange-400 text-[10px] font-black tracking-[0.3em] uppercase">
                  Tiket Akses
                </span>
              </div>
              <h2 className="text-white font-black text-3xl tracking-tight uppercase italic">
                Masuk
              </h2>
              <p className="text-zinc-400 text-xs font-medium mt-2 opacity-70 uppercase tracking-widest">
                Masukkan detail akun untuk akses
              </p>
            </div>
          </div>

          {/* ── PERFORATED LINE ── */}
          <div className="relative bg-white flex items-center h-0">
            <div className="absolute -left-5 w-10 h-10 bg-zinc-100 rounded-full border border-zinc-200 z-10" />
            <div className="absolute -right-5 w-10 h-10 bg-zinc-100 rounded-full border border-zinc-200 z-10" />
            <div className="flex-1 border-t-[3px] border-dashed border-zinc-100 mx-10" />
          </div>

          {/* ── TICKET BOTTOM: Form ── */}
          <div className="bg-white px-8 pt-12 pb-10">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Alamat Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase mb-2 block">
                      Alamat Email
                    </FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="NAMA@EMAIL.COM"
                      className="bg-zinc-50 border-zinc-200 rounded-xl h-12 text-sm px-5 focus:ring-4 focus:ring-orange-400/5 focus:border-orange-500 transition-all placeholder:text-zinc-300"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Kata Sandi */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex justify-between items-center mb-2">
                      <FieldLabel className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase block">
                        Kata Sandi
                      </FieldLabel>
                      <Link
                        to="/forgot-password"
                        className="text-[10px] font-black uppercase text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        Lupa Password?
                      </Link>
                    </div>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="bg-zinc-50 border-zinc-200 rounded-xl h-12 text-sm px-5 focus:ring-4 focus:ring-orange-400/5 focus:border-orange-500 transition-all"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Tombol Aksi */}
              <div className="pt-2 space-y-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-zinc-900 hover:bg-black disabled:opacity-40 text-white text-xs font-black py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-orange-400" />
                  )}
                  {isPending ? "Memvalidasi..." : "Masuk Sekarang"}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-100"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px]">
                    <span className="bg-white px-4 text-zinc-400 font-bold uppercase tracking-widest">
                      Atau Masuk Lewat
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLogin()}
                  className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 text-xs font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] uppercase tracking-widest"
                >
                  <Chrome className="w-4 h-4" />
                  Akun Google
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-10 text-center">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="text-zinc-900 hover:text-orange-500 transition-colors border-b-2 border-zinc-900 hover:border-orange-500 ml-1"
                >
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex justify-center items-center gap-2 opacity-40">
          <ShieldCheck className="w-4 h-4 text-zinc-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            Sesi Terenkripsi 256-bit Aman
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
