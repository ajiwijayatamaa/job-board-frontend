import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  FileText,
  ImageIcon,
  MapPin,
  Save,
  Users,
  Sparkles,
  Ticket,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link, redirect } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import useCreateEvent from "~/hooks/api/useCreateEvent";
import {
  createEventSchema,
  type CreateEventSchema,
} from "~/schema/create-event";
import { useAuth } from "~/stores/useAuth";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";
import { cn } from "~/lib/utils";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ORGANIZER") return redirect("/");
};

export default function CreateEvent() {
  const today = new Date().toISOString().split("T")[0];

  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      price: 0,
      totalSeats: 100,
      startDate: today,
      endDate: today,
      image: undefined,
    },
  });

  const { mutateAsync: createEvent, isPending } = useCreateEvent();

  async function onSubmit(data: CreateEventSchema) {
    await createEvent(data);
  }

  return (
    <div className="flex min-h-screen bg-zinc-50/50">
      <OrganizerSidebar />

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
                <Link to="/organizer/events">
                  <ArrowLeft className="mr-2 h-3 w-3" /> Back to Events
                </Link>
              </Button>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  Event Publisher
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">
                Buat <span className="text-orange-500">Event Baru</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium mt-1">
                Lengkapi detail di bawah untuk mempublikasikan acara Anda.
              </p>
            </div>

            {/* FORM START */}
            <form
              id="form-create-event"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 pb-20"
            >
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content (Left) */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Basic Information */}
                  <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                    <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
                      <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
                        <FileText className="h-5 w-5 text-orange-500" />
                        Informasi Dasar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                              Nama Event *
                            </FieldLabel>
                            <Input
                              {...field}
                              className="h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-bold tracking-tight"
                              placeholder="Contoh: Konser Musik Jazz Tahunan"
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
                              Deskripsi Event
                            </FieldLabel>
                            <Textarea
                              {...field}
                              className="rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-medium min-h-[200px]"
                              placeholder="Ceritakan detail menarik tentang acara Anda..."
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="location"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                              Lokasi Venue
                            </FieldLabel>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
                              <Input
                                {...field}
                                className="pl-12 h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-bold"
                                placeholder="Gedung, Kota, atau Link Zoom"
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

                  {/* Schedule */}
                  <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                    <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
                      <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
                        <Calendar className="h-5 w-5 text-orange-500" />
                        Waktu & Jadwal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid gap-6 sm:grid-cols-2">
                      <Controller
                        name="startDate"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                              Waktu Mulai *
                            </FieldLabel>
                            <Input
                              {...field}
                              type="datetime-local"
                              className="h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-bold uppercase text-[11px]"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="endDate"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                              Waktu Selesai *
                            </FieldLabel>
                            <Input
                              {...field}
                              type="datetime-local"
                              className="h-12 rounded-xl border-zinc-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-bold uppercase text-[11px]"
                            />
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
                  {/* Ticket Setting */}
                  <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden relative">
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-zinc-50 rounded-full border border-zinc-100 -translate-y-1/2" />
                    <CardHeader className="bg-zinc-900 text-white">
                      <CardTitle className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-orange-500" />
                        Pengaturan Tiket
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6 mt-4">
                      <Controller
                        name="price"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-[10px] font-black uppercase text-zinc-400">
                              Harga (IDR)
                            </FieldLabel>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-orange-600 italic">
                                Rp
                              </span>
                              <Input
                                type="number"
                                className="pl-12 h-12 rounded-xl border-zinc-200 bg-zinc-50/50 font-black italic text-lg"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? 0
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

                      <Controller
                        name="totalSeats"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-[10px] font-black uppercase text-zinc-400">
                              Total Kursi
                            </FieldLabel>
                            <div className="relative">
                              <Users className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                              <Input
                                type="number"
                                className="pl-12 h-12 rounded-xl border-zinc-200 bg-zinc-50/50 font-black italic text-lg"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value),
                                  )
                                }
                              />
                            </div>
                            <p className="text-[10px] text-zinc-400 font-medium italic mt-2 leading-relaxed">
                              * Kapasitas tersedia akan disetel sesuai total
                              kursi.
                            </p>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Banner Image */}
                  <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                    <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-900 italic">
                        Banner Event
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Controller
                        name="image"
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
                              <p className="text-[10px] font-black uppercase tracking-tighter text-center leading-tight">
                                {field.value
                                  ? (field.value as File).name
                                  : "Upload Image"}
                              </p>
                              <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
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
                      form="form-create-event"
                      disabled={isPending}
                      className="w-full bg-zinc-900 hover:bg-black text-white rounded-2xl h-14 shadow-xl shadow-zinc-200 transition-all active:scale-95 font-black uppercase text-xs tracking-[0.2em] italic"
                    >
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Publishing...
                        </div>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4 text-orange-500" />{" "}
                          Create Event
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
                      <Link to="/organizer/events">Batal & Buang</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
