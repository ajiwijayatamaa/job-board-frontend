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
    // konversi ISO string ke format datetime-local (yyyy-MM-ddTHH:mm)
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
      <div className="flex min-h-screen bg-zinc-50/50 w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Back */}
            <Button
              variant="ghost"
              asChild
              className="mb-2 -ml-2 text-zinc-500 hover:text-zinc-900 font-bold uppercase text-[10px] tracking-widest"
            >
              <Link to={`/admin/jobs/${id}`}>
                <ArrowLeft className="mr-2 h-3 w-3" /> Kembali ke Detail Job
              </Link>
            </Button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarClock className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  Jadwal Wawancara
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">
                Interview <span className="text-orange-500">Schedule</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium mt-1">
                Kelola jadwal wawancara untuk pelamar yang lolos seleksi.
              </p>
            </div>

            {/* List */}
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
                <CardTitle className="flex items-center gap-2 text-sm font-black uppercase italic tracking-tight text-zinc-900">
                  <CalendarDays className="w-4 h-4 text-orange-500" />
                  Daftar Jadwal
                  {interviews.length > 0 && (
                    <span className="ml-auto text-xs font-bold text-zinc-400">
                      {interviews.length} jadwal
                    </span>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {/* Loading */}
                {isLoading && (
                  <div className="py-12 flex justify-center">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* Empty */}
                {!isLoading && interviews.length === 0 && (
                  <div className="py-16 text-center">
                    <CalendarDays className="w-10 h-10 mx-auto mb-3 text-zinc-200" />
                    <p className="text-sm font-bold text-zinc-400">
                      Belum ada jadwal interview.
                    </p>
                    <p className="text-xs text-zinc-300 mt-1">
                      Jadwalkan interview dari daftar pelamar di halaman detail
                      job.
                    </p>
                  </div>
                )}

                {/* Interview list */}
                <div className="divide-y divide-zinc-50">
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
          className="rounded-[2rem] max-w-sm"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="font-black uppercase italic text-zinc-900">
              Edit Jadwal Interview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">
                Tanggal & Waktu *
              </p>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full h-10 rounded-xl border border-zinc-200 px-3 text-sm font-medium focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">
                Link / Lokasi (opsional)
              </p>
              <Input
                value={locationLink}
                onChange={(e) => setLocationLink(e.target.value)}
                placeholder="https://meet.google.com/... atau nama gedung"
                className="h-10 rounded-xl border-zinc-200 text-sm"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1 rounded-2xl font-black uppercase text-[10px]"
                onClick={() => setEditingInterview(null)}
              >
                Batal
              </Button>
              <Button
                onClick={handleUpdateConfirm}
                disabled={!interviewDate || isUpdating}
                className="flex-1 bg-zinc-900 hover:bg-black text-white rounded-2xl font-black uppercase text-[10px]"
              >
                {isUpdating ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase italic">
              Hapus Jadwal Interview?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Jadwal interview ini akan dihapus permanen dan pelamar tidak akan
              mendapat notifikasi pembatalan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-black uppercase text-[10px]">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 rounded-xl font-black uppercase text-[10px]"
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
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/50 transition-colors">
      {/* Avatar */}
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage src={user.profilePhoto ?? undefined} />
        <AvatarFallback className="bg-orange-100 text-orange-600 font-black text-xs">
          {user.fullName?.[0] ?? user.email[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Info pelamar */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-zinc-900 truncate">
          {user.fullName ?? "—"}
        </p>
        <p className="text-[10px] text-zinc-400 font-medium truncate">
          {user.email}
        </p>
      </div>

      {/* Info jadwal */}
      <div className="hidden sm:flex flex-col items-end gap-1">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <CalendarDays className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-xs font-bold">
            {date.toLocaleDateString("id-ID", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
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
          <div className="flex items-center gap-1.5 text-zinc-400">
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
          className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
          onClick={onEdit}
          title="Edit jadwal"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50"
          onClick={onDelete}
          title="Hapus jadwal"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
