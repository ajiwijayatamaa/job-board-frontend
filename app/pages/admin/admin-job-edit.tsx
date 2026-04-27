import { zodResolver } from "@hookform/resolvers/zod";
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
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Link, useParams } from "react-router";
import AdminSidebar from "~/components/admin/admin-sidebar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { SidebarProvider } from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";
import useGetAdminJobById from "~/hooks/api/useGetAdminJobById";
import useUpdateJob from "~/hooks/api/useUpdateJob";
import { cn } from "~/lib/utils";
import { updateJobSchema, type UpdateJobSchema } from "~/schema/job";

export default function AdminJobEditPage() {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);

  const [tagInput, setTagInput] = useState("");
  const [existingBannerUrl, setExistingBannerUrl] = useState<string | null>(
    null,
  );

  const { data: job, isLoading } = useGetAdminJobById(jobId);
  const { mutateAsync: updateJob, isPending } = useUpdateJob(jobId);

  const form = useForm<UpdateJobSchema>({
    resolver: zodResolver(updateJobSchema),
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

  // Pre-fill form ketika data job berhasil di-fetch
  useEffect(() => {
    if (!job) return;

    // Simpan URL banner lama untuk preview
    setExistingBannerUrl(job.banner ?? null);

    form.reset({
      title: job.title,
      description: job.description,
      category: job.category,
      city: job.city,
      // Convert ISO string → YYYY-MM-DD untuk input type="date"
      deadline: job.deadline
        ? new Date(job.deadline).toISOString().split("T")[0]
        : "",
      tags: job.tags,
      // Salary dari API adalah string | null, konversi ke number
      salary: job.salary ? Number(job.salary) : undefined,
      banner: undefined,
    });
  }, [job, form]);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    const current = form.getValues("tags") ?? [];
    if (current.includes(trimmed)) return;
    form.setValue("tags", [...current, trimmed], { shouldValidate: true });
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    const current = form.getValues("tags") ?? [];
    form.setValue(
      "tags",
      current.filter((t) => t !== tag),
      { shouldValidate: true },
    );
  };

  const onSubmit: SubmitHandler<UpdateJobSchema> = async (data) => {
    await updateJob(data);
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-[#F0F5FB] w-full">
          <AdminSidebar />
          <main className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-72" />
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
              </div>
              <div className="space-y-8">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F0F5FB] w-full">
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
                  className="mb-6 -ml-2 text-slate-400 hover:text-[#0F2342] font-semibold uppercase text-[10px] tracking-widest"
                >
                  <Link to={`/admin/jobs/${jobId}`}>
                    <ArrowLeft className="mr-2 h-3 w-3" /> Kembali ke Detail
                    Lowongan
                  </Link>
                </Button>
                <div className="flex items-center gap-2 mb-2">
                  <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none">
                    <rect width="20" height="20" rx="5" fill="#1D5FAD" />
                    <circle
                      cx="8"
                      cy="8"
                      r="3"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 11v4M5 15h6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M13 7h4M13 10h3M13 13h3.5"
                      stroke="#7DD3FC"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
                    Job Publisher
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-[#0F2342]">
                  Edit Lowongan
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Perbarui detail lowongan pekerjaan di bawah ini.
                </p>
              </div>

              {/* Form */}
              <form
                id="form-edit-job"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 pb-20"
              >
                <div className="grid gap-8 lg:grid-cols-3">
                  {/* Main Content (Left) */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Informasi Dasar */}
                    <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
                      <CardHeader className="border-b border-[#E2EAF4] bg-[#F4F8FF]">
                        <CardTitle className="flex items-center gap-3 text-[#0F2342] font-bold text-base">
                          <FileText className="h-4 w-4 text-[#1D5FAD]" />
                          Informasi Dasar
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <Controller
                          name="title"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                Judul Lowongan *
                              </FieldLabel>
                              <Input
                                {...field}
                                className="h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium"
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
                              <FieldLabel className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                Deskripsi Pekerjaan *
                              </FieldLabel>
                              <Textarea
                                {...field}
                                className="rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium min-h-[200px]"
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
                                <FieldLabel className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                  Kategori *
                                </FieldLabel>
                                <div className="relative">
                                  <Briefcase className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1D5FAD]" />
                                  <Input
                                    {...field}
                                    className="pl-12 h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium"
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
                                <FieldLabel className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                  Kota *
                                </FieldLabel>
                                <div className="relative">
                                  <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1D5FAD]" />
                                  <Input
                                    {...field}
                                    className="pl-12 h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium"
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
                    <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
                      <CardHeader className="border-b border-[#E2EAF4] bg-[#F4F8FF]">
                        <CardTitle className="flex items-center gap-3 text-[#0F2342] font-bold text-base">
                          <Tag className="h-4 w-4 text-[#1D5FAD]" />
                          Tags
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <Controller
                          name="tags"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs font-semibold uppercase tracking-widest text-slate-400">
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
                                  className="h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium"
                                  placeholder="Contoh: React, TypeScript..."
                                />
                                <Button
                                  type="button"
                                  onClick={addTag}
                                  className="h-12 px-4 rounded-xl bg-[#1D5FAD] hover:bg-[#174E8F] text-white font-semibold text-xs shrink-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              {(field.value?.length ?? 0) > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                  {field.value?.map((tag) => (
                                    <span
                                      key={tag}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF4FF] text-[#1D5FAD] border border-[#C8D9EE] rounded-full text-[11px] font-semibold"
                                    >
                                      {tag}
                                      <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-rose-500 transition-colors"
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
                    <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
                      <CardHeader className="bg-[#0F2342] text-white">
                        <CardTitle className="text-sm font-bold tracking-wide flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#7DD3FC]" />
                          Detail Lowongan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6 mt-4">
                        <Controller
                          name="deadline"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                Deadline *
                              </FieldLabel>
                              <Input
                                {...field}
                                type="date"
                                className="h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD] font-medium text-[11px]"
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
                              <FieldLabel className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                Gaji (Opsional)
                              </FieldLabel>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1D5FAD]">
                                  Rp
                                </span>
                                <Input
                                  type="number"
                                  className="pl-12 h-12 rounded-xl border-[#D1DFF0] bg-[#F4F8FF] font-semibold text-base"
                                  placeholder="0"
                                  value={field.value ?? ""}
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
                    <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
                      <CardHeader className="bg-[#F4F8FF] border-b border-[#E2EAF4]">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-[#0F2342]">
                          Banner Lowongan (Opsional)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        {/* Preview banner lama jika ada dan belum diganti */}
                        {existingBannerUrl && !form.watch("banner") && (
                          <div className="relative rounded-xl overflow-hidden border border-[#E2EAF4]">
                            <img
                              src={existingBannerUrl}
                              alt="Banner saat ini"
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-end p-3">
                              <span className="text-[9px] font-semibold uppercase tracking-widest text-white bg-black/50 px-2 py-1 rounded-full">
                                Banner Saat Ini
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setExistingBannerUrl(null)}
                              className="absolute top-2 right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}

                        <Controller
                          name="banner"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <div
                                className={cn(
                                  "group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all p-8",
                                  field.value
                                    ? "border-[#1D5FAD] bg-[#EEF4FF]"
                                    : "border-[#C8D9EE] bg-[#F4F8FF] hover:bg-[#EEF4FF] hover:border-[#A5C0E4]",
                                )}
                              >
                                <div
                                  className={cn(
                                    "p-4 rounded-full mb-3 transition-transform group-hover:scale-110",
                                    field.value
                                      ? "bg-[#1D5FAD] text-white"
                                      : "bg-white text-slate-400 shadow-sm",
                                  )}
                                >
                                  <ImageIcon className="h-6 w-6" />
                                </div>
                                <p className="text-[10px] font-semibold uppercase tracking-tight text-center leading-tight text-slate-500">
                                  {field.value
                                    ? (field.value as File).name
                                    : existingBannerUrl
                                      ? "Ganti Banner"
                                      : "Upload Banner"}
                                </p>
                                <p className="text-[9px] text-slate-400 font-medium mt-1">
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
                        form="form-edit-job"
                        disabled={isPending}
                        className="w-full bg-[#1D5FAD] hover:bg-[#174E8F] text-white rounded-xl h-14 shadow-lg shadow-[#1D5FAD]/20 transition-all active:scale-95 font-semibold text-sm"
                      >
                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Menyimpan...
                          </div>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Simpan Perubahan
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full rounded-xl h-14 font-semibold text-xs tracking-wide text-slate-400 hover:text-rose-500 transition-colors"
                        asChild
                        disabled={isPending}
                      >
                        <Link to={`/admin/jobs/${jobId}`}>Batal & Kembali</Link>
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
