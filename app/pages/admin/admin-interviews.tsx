import { useState } from "react";
import { motion } from "framer-motion";
import { Link, redirect, useParams } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Pencil,
  Trash2,
  CalendarClock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import AdminSidebar from "~/components/admin/admin-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import useGetInterviewsByJob from "~/hooks/api/useGetInterviewsByJob";
import useUpdateInterview from "~/hooks/api/useUpdateInterview";
import useDeleteInterview from "~/hooks/api/useDeleteInterview";
import type { Interview } from "~/types/interview";
import { useAuth } from "~/stores/useAuth";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ADMIN") return redirect("/");
};

export default function AdminInterviewsPage() {
  const { id } = useParams<{ id: string }>();
  const numericJobId = Number(id);

  const { data, isLoading } = useGetInterviewsByJob(numericJobId);
  const interviews = data?.data ?? [];

  const [editingInterview, setEditingInterview] = useState<Interview | null>(
    null,
  );
  const [interviewDate, setInterviewDate] = useState("");
  const [locationLink, setLocationLink] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { mutate: updateInterview, isPending: isUpdating } = useUpdateInterview(
    editingInterview?.id ?? 0,
    numericJobId,
  );
  const { mutate: deleteInterview, isPending: isDeleting } =
    useDeleteInterview(numericJobId);

  const openEdit = (interview: Interview) => {
    setEditingInterview(interview);
    const dt = new Date(interview.interviewDate);
    const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setInterviewDate(local);
    setLocationLink(interview.locationLink ?? "");
  };

  const handleUpdateConfirm = () => {
    if (!interviewDate || !editingInterview) return;
    updateInterview(
      {
        interviewDate: new Date(interviewDate).toISOString(),
        locationLink: locationLink || undefined,
      },
      {
        onSuccess: () => {
          setEditingInterview(null);
          setInterviewDate("");
          setLocationLink("");
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    deleteInterview(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F8FAFC] w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Back */}
            <Button
              variant="ghost"
              asChild
              className="-ml-2 text-slate-400 hover:text-[#0F2342] hover:bg-slate-200/50 font-bold uppercase text-[10px] tracking-widest transition-all"
            >
              <Link to={`/admin/jobs/${id}`}>
                <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Kembali ke Detail Job
              </Link>
            </Button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1D5FAD]/10 rounded-xl">
                <CalendarClock className="w-5 h-5 text-[#1D5FAD]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Jadwal Wawancara
                </span>
                <h1 className="text-3xl font-black text-[#0F2342] uppercase italic tracking-tighter">
                  Interview <span className="text-[#1D5FAD]">Schedule</span>
                </h1>
              </div>
            </div>

            {/* List Card */}
            <Card className="border border-[#E2EAF4] shadow-none rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="border-b border-[#F4F8FF] bg-[#F4F8FF]/50 px-8 py-6">
                <CardTitle className="flex items-center gap-3">
                  <CalendarDays className="w-4 h-4 text-[#1D5FAD]" />
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[#0F2342]">
                    Daftar Jadwal
                  </span>
                  {interviews.length > 0 && (
                    <span className="ml-auto text-[10px] font-bold text-slate-400">
                      {interviews.length} jadwal
                    </span>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {/* Loading */}
                {isLoading && (
                  <div className="py-16 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#1D5FAD]/10 border-t-[#1D5FAD] rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Memuat Jadwal...
                    </p>
                  </div>
                )}

                {/* Empty */}
                {!isLoading && interviews.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#F4F8FF] flex items-center justify-center mx-auto mb-4">
                      <CalendarDays className="w-6 h-6 text-[#1D5FAD]/40" />
                    </div>
                    <p className="text-sm font-black text-[#0F2342] uppercase italic">
                      Belum ada jadwal
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      Jadwalkan interview dari daftar pelamar di halaman detail
                      job.
                    </p>
                  </div>
                )}

                {/* Interview list */}
                <div className="divide-y divide-[#F4F8FF]">
                  {interviews.map((interview) => (
                    <InterviewRow
                      key={interview.id}
                      interview={interview}
                      onEdit={() => openEdit(interview)}
                      onDelete={() => setDeleteId(interview.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingInterview}
        onOpenChange={() => setEditingInterview(null)}
      >
        <DialogContent
          className="rounded-[2rem] max-w-sm border border-[#E2EAF4] shadow-xl"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="font-black uppercase italic text-[#0F2342] tracking-tighter">
              Edit Jadwal Interview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Tanggal & Waktu *
              </p>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full h-11 rounded-xl border border-[#D1DFF0] px-3 text-sm font-medium text-[#0F2342] focus:outline-none focus:border-[#1D5FAD] focus:ring-4 focus:ring-[#1D5FAD]/5 transition-all"
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Link / Lokasi (opsional)
              </p>
              <Input
                value={locationLink}
                onChange={(e) => setLocationLink(e.target.value)}
                placeholder="https://meet.google.com/... atau nama gedung"
                className="h-11 rounded-xl border-[#D1DFF0] text-sm focus-visible:border-[#1D5FAD] focus-visible:ring-[#1D5FAD]/5 font-medium"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-slate-100"
                onClick={() => setEditingInterview(null)}
              >
                Batal
              </Button>
              <Button
                onClick={handleUpdateConfirm}
                disabled={!interviewDate || isUpdating}
                className="flex-1 bg-[#1D5FAD] hover:bg-[#0F2342] text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all"
              >
                {isUpdating ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-[2rem] border border-[#E2EAF4]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase italic text-[#0F2342] tracking-tighter">
              Hapus Jadwal Interview?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-sm">
              Jadwal interview ini akan dihapus permanen dan pelamar tidak akan
              mendapat notifikasi pembatalan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-black uppercase text-[10px] tracking-widest border-[#E2EAF4]">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-rose-500 hover:bg-rose-600 rounded-xl font-black uppercase text-[10px] tracking-widest"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}

// ── Interview Row Component ──────────────────────────────────────────────────

function InterviewRow({
  interview,
  onEdit,
  onDelete,
}: {
  interview: Interview;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const user = interview.application.user;
  const date = new Date(interview.interviewDate);

  return (
    <div className="flex items-center gap-4 px-8 py-5 hover:bg-[#F4F8FF]/50 transition-colors">
      {/* Avatar */}
      <Avatar className="w-10 h-10 flex-shrink-0 rounded-xl">
        <AvatarImage src={user.profilePhoto ?? undefined} />
        <AvatarFallback className="bg-[#1D5FAD]/10 text-[#1D5FAD] font-black text-xs rounded-xl">
          {user.fullName?.[0] ?? user.email[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Info pelamar */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-[#0F2342] truncate">
          {user.fullName ?? "—"}
        </p>
        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
          {user.email}
        </p>
      </div>

      {/* Info jadwal */}
      <div className="hidden sm:flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-[#1D5FAD]" />
          <span className="text-xs font-bold text-[#0F2342]">
            {date.toLocaleDateString("id-ID", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">
            {date.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            WIB
          </span>
        </div>
        {interview.locationLink && (
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium max-w-[160px] truncate">
              {interview.locationLink}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-[#1D5FAD] hover:bg-[#1D5FAD]/5 rounded-lg transition-all"
          onClick={onEdit}
          title="Edit jadwal"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
          onClick={onDelete}
          title="Hapus jadwal"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
