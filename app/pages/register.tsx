import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Ticket, Sparkles, UserPlus, ShieldCheck } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import useRegister from "~/hooks/api/useRegister";
import { registerSchema, type RegisterSchema } from "~/schema/register";

const Register = () => {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
      referrerCode: "",
    },
  });

  const { mutateAsync: register, isPending } = useRegister();

  async function onSubmit(data: RegisterSchema) {
    await register(data);
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-6 selection:bg-orange-100 selection:text-orange-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[450px]"
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
                  Registrasi Attendee
                </span>
              </div>
              <h2 className="text-white font-black text-3xl tracking-tight uppercase italic">
                Buat Akun
              </h2>
              <p className="text-zinc-400 text-xs font-medium mt-2 opacity-70 uppercase tracking-widest">
                Daftar sekarang untuk akses event eksklusif
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
            <form
              id="form-register"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 gap-5">
                {/* Nama Lengkap */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase mb-2 block">
                        Nama Lengkap
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="NAMA LENGKAP ANDA"
                        className="bg-zinc-50 border-zinc-200 rounded-xl h-12 text-sm px-5 focus:ring-4 focus:ring-orange-400/5 focus:border-orange-500 transition-all"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Email */}
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
                        className="bg-zinc-50 border-zinc-200 rounded-xl h-12 text-sm px-5 focus:ring-4 focus:ring-orange-400/5 focus:border-orange-500 transition-all"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* Role Selection */}
                  <Controller
                    name="role"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase mb-2 block">
                          Daftar Sebagai
                        </FieldLabel>
                        <select
                          {...field}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl h-12 text-[11px] px-4 font-bold uppercase tracking-tight focus:ring-4 focus:ring-orange-400/5 focus:border-orange-500 outline-none transition-all"
                        >
                          <option value="CUSTOMER">Customer</option>
                          <option value="ORGANIZER">Organizer</option>
                        </select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Referral Code */}
                  <Controller
                    name="referrerCode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase mb-2 block">
                          Kode Referral
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder="OPSIONAL"
                          className="bg-zinc-50 border-zinc-200 rounded-xl h-12 text-sm px-5 focus:ring-4 focus:ring-orange-400/5 focus:border-orange-500 transition-all"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Password */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase mb-2 block">
                        Kata Sandi
                      </FieldLabel>
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
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  form="form-register"
                  disabled={isPending}
                  className="w-full bg-zinc-900 hover:bg-black text-white text-xs font-black h-14 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-zinc-200 transition-all active:scale-[0.98] uppercase tracking-widest"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                  ) : (
                    <UserPlus className="w-4 h-4 text-orange-400" />
                  )}
                  {isPending ? "Memproses..." : "Daftar Sekarang"}
                </Button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-10 text-center">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="text-zinc-900 hover:text-orange-500 transition-colors border-b-2 border-zinc-900 hover:border-orange-500 ml-1"
                >
                  Masuk Saja
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex justify-center items-center gap-2 opacity-40">
          <ShieldCheck className="w-4 h-4 text-zinc-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            Sistem Keanggotaan Terverifikasi
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
