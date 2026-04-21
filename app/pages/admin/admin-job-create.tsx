import { motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  FileText,
  ImageIcon,
  MapPin,
  Plus,
  Save,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Link, redirect } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminSidebar from "~/components/admin/admin-sidebar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { SidebarProvider } from "~/components/ui/sidebar";
import { Textarea } from "~/components/ui/textarea";
import useCreateJob from "~/hooks/api/useCreateJob";
import { cn } from "~/lib/utils";
import { createJobSchema, type CreateJobSchema } from "~/schema/job";
import { useAuth } from "~/stores/useAuth";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ADMIN") return redirect("/");
};

export default function AdminJobCreatePage() {
  const [tagInput, setTagInput] = useState("");

  const form = useForm<CreateJobSchema>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      city: "",
      deadline: "",
      tags: [],
      salary: undefined,
      banner: undefined,
    },
  });

  const { mutateAsync: createJob, isPending } = useCreateJob();

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    const current = form.getValues("tags");
    if (current.includes(trimmed)) return;
    form.setValue("tags", [...current, trimmed], { shouldValidate: true });
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    const current = form.getValues("tags");
    form.setValue(
      "tags",
      current.filter((t) => t !== tag),
      { shouldValidate: true },
    );
  };

  const onSubmit: SubmitHandler<CreateJobSchema> = async (data) => {
    await createJob(data);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-zinc-50/50 w-full">
        <AdminSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-10 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="mb-10">
                <Button
                  variant="ghost"
                  asChild
                  className="mb-6 -ml-2 text-zinc-500 hover:text-zinc-900 font-bold uppercase text-[10px] tracking-widest"
                >
                  <Link to="/admin/jobs">
                    <ArrowLeft className="mr-2 h-3 w-3" /> Kembali ke Daftar
                    Lowongan
                  </Link>
                </Button>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                    Job Publisher
                  </span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">
                  Buat <span className="text-orange-500">Lowongan Baru</span>
                </h1>
                <p className="text-zinc-500 text-sm font-medium mt-1">
                  Lengkapi detail di bawah untuk mempublikasikan lowongan
                  pekerjaan.
                </p>
              </div>

              {/* Form */}
              <form
                id="form-create-job"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 pb-20"
              >
                <div className="grid gap-8 lg:grid-cols-3">
                  {/* Main Content (Left) */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Informasi Dasar */}
                    <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                      <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
                        <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
                          <FileText className="h-5 w-5 text-orange-500" />
                          Informasi Dasar
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <Controller
                          name="title"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                                Judul Lowongan *
                              </FieldLabel>
                              <Input
                                {...field}
                                className="h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-bold tracking-tight"
                                placeholder="Contoh: Senior Frontend Engineer"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name="description"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                                Deskripsi Pekerjaan *
                              </FieldLabel>
                              <Textarea
                                {...field}
                                className="rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-medium min-h-[200px]"
                                placeholder="Jelaskan tanggung jawab, kualifikasi, dan benefit pekerjaan ini..."
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />

                        <div className="grid gap-6 sm:grid-cols-2">
                          <Controller
                            name="category"
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                                  Kategori *
                                </FieldLabel>
                                <div className="relative">
                                  <Briefcase className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
                                  <Input
                                    {...field}
                                    className="pl-12 h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-bold"
                                    placeholder="Contoh: Technology"
                                  />
                                </div>
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />

                          <Controller
                            name="city"
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                                  Kota *
                                </FieldLabel>
                                <div className="relative">
                                  <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
                                  <Input
                                    {...field}
                                    className="pl-12 h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-bold"
                                    placeholder="Contoh: Jakarta"
                                  />
                                </div>
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                      <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
                        <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
                          <Tag className="h-5 w-5 text-orange-500" />
                          Tags
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <Controller
                          name="tags"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                                Tag Keahlian *
                              </FieldLabel>
                              <div className="flex gap-2">
                                <Input
                                  value={tagInput}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addTag();
                                    }
                                  }}
                                  className="h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-bold"
                                  placeholder="Contoh: React, TypeScript..."
                                />
                                <Button
                                  type="button"
                                  onClick={addTag}
                                  className="h-12 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest shrink-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              {field.value.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                  {field.value.map((tag) => (
                                    <span
                                      key={tag}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest"
                                    >
                                      {tag}
                                      <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-red-500 transition-colors"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar (Right) */}
                  <div className="space-y-8">
                    {/* Deadline & Salary */}
                    <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden relative">
                      <div className="absolute top-1/2 -left-3 w-6 h-6 bg-zinc-50 rounded-full border border-zinc-100 -translate-y-1/2" />
                      <CardHeader className="bg-zinc-900 text-white">
                        <CardTitle className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          Detail Lowongan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6 mt-4">
                        <Controller
                          name="deadline"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-[10px] font-black uppercase text-zinc-400">
                                Deadline *
                              </FieldLabel>
                              <Input
                                {...field}
                                type="date"
                                className="h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-bold uppercase text-[11px]"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name="salary"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-[10px] font-black uppercase text-zinc-400">
                                Gaji (Opsional)
                              </FieldLabel>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-orange-600 italic">
                                  Rp
                                </span>
                                <Input
                                  type="number"
                                  className="pl-12 h-12 rounded-xl border-zinc-200 bg-zinc-50/50 font-black italic text-lg"
                                  placeholder="0"
                                  value={field.value || ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value === ""
                                        ? undefined
                                        : Number(e.target.value),
                                    )
                                  }
                                />
                              </div>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Banner */}
                    <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                      <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-900 italic">
                          Banner Lowongan (Opsional)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <Controller
                          name="banner"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <div
                                className={cn(
                                  "group relative flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed transition-all p-8",
                                  field.value
                                    ? "border-orange-500 bg-orange-50/10"
                                    : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-300",
                                )}
                              >
                                <div
                                  className={cn(
                                    "p-4 rounded-full mb-3 transition-transform group-hover:scale-110",
                                    field.value
                                      ? "bg-orange-500 text-white"
                                      : "bg-white text-zinc-400 shadow-sm",
                                  )}
                                >
                                  <ImageIcon className="h-6 w-6" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-tighter text-center leading-tight text-zinc-500">
                                  {field.value
                                    ? (field.value as File).name
                                    : "Upload Banner"}
                                </p>
                                <p className="text-[9px] text-zinc-400 font-medium mt-1">
                                  JPG, JPEG, PNG — maks. 1MB
                                </p>
                                <input
                                  type="file"
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) field.onChange(file);
                                  }}
                                />
                              </div>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      <Button
                        type="submit"
                        form="form-create-job"
                        disabled={isPending}
                        className="w-full bg-zinc-900 hover:bg-black text-white rounded-2xl h-14 shadow-xl shadow-zinc-200 transition-all active:scale-95 font-black uppercase text-xs tracking-[0.2em] italic"
                      >
                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Menyimpan...
                          </div>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4 text-orange-500" />
                            Buat Lowongan
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
                        asChild
                        disabled={isPending}
                      >
                        <Link to="/admin/jobs">Batal & Buang</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
