import {
  CalendarPlus,
  Eye,
  FileText,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import PaginationSection from "~/components/pagination-section";
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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import useCreateInterview from "~/hooks/api/useCreateInterview";
import useGetApplicants from "~/hooks/api/useGetApplicants";
import useUpdateApplicantStatus from "~/hooks/api/useUpdateApplicantStatus";
import { cn } from "~/lib/utils";
import type { Application, ApplicationStatus } from "~/types/application";
import ApplicantDetailDialog from "./applicant-detail-dialog";

// ── Status config ── logic identik, hanya styling beda
const statusConfig: Record<
  ApplicationStatus,
  { label: string; dot: string; badge: string }
> = {
  PENDING: {
    label: "Pending",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  },
  PROCESSED: {
    label: "Diproses",
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
  INTERVIEW: {
    label: "Interview",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  ACCEPTED: {
    label: "Diterima",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  REJECTED: {
    label: "Ditolak",
    dot: "bg-rose-400",
    badge: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
  },
};

// ── allowedTransitions — identik ──
const allowedTransitions: Record<
  ApplicationStatus,
  { value: string; label: string }[]
> = {
  PENDING: [{ value: "PROCESSED", label: "Diproses" }],
  PROCESSED: [
    { value: "INTERVIEW", label: "Interview" },
    { value: "REJECTED", label: "Ditolak" },
  ],
  INTERVIEW: [
    { value: "ACCEPTED", label: "Diterima" },
    { value: "REJECTED", label: "Ditolak" },
  ],
  ACCEPTED: [],
  REJECTED: [],
};

// ════════════════════════════════════════════════
// ApplicantList
// ════════════════════════════════════════════════
export default function ApplicantList({ jobId }: { jobId: number }) {
  // ── state & hooks — identik ──
  const [page, setPage] = useQueryState(
    "applicantPage",
    parseAsInteger.withDefault(1),
  );
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [education, setEducation] = useQueryState("education", {
    defaultValue: "",
  });
  const [debouncedSearch] = useDebounceValue(search, 500);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isPending } = useGetApplicants(jobId, {
    page,
    take: 10,
    search: debouncedSearch,
    education: education || undefined,
    sortBy: "appliedAt",
    sortOrder: "asc",
  });

  return (
    <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
      {/* ── Header ── */}
      <CardHeader className="px-6 py-5 border-b border-[#E2EAF4] bg-[#F4F8FF]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#1D5FAD]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Manajemen Pelamar
              </p>
              <h2 className="text-sm font-bold text-[#0F2342]">
                Daftar Pelamar
              </h2>
            </div>
          </div>
          {data?.meta.total !== undefined && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-[#E2EAF4]">
              <span className="text-lg font-bold text-[#0F2342]">
                {data.meta.total}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                pelamar
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      {/* ── Filters ── */}
      <div className="px-6 py-4 flex flex-wrap gap-3 border-b border-[#E2EAF4] bg-white">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder="Cari nama pelamar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl border-[#D1DFF0] text-sm bg-[#F4F8FF] focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD]"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none z-10" />
          <Select
            value={education || "all"}
            onValueChange={(v) => setEducation(v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9 w-44 pl-9 rounded-xl border-[#D1DFF0] text-sm bg-[#F4F8FF] focus:ring-[#1D5FAD]/20">
              <span className="text-sm text-slate-600">
                {education || "Semua Pendidikan"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Pendidikan</SelectItem>
              <SelectItem value="SMA">SMA</SelectItem>
              <SelectItem value="D3">D3</SelectItem>
              <SelectItem value="S1">S1</SelectItem>
              <SelectItem value="S2">S2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Table Head ── */}
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-2.5 bg-slate-50 border-b border-[#E2EAF4]">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Pelamar
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Skor Tes
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Status
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Aksi
        </p>
      </div>

      <CardContent className="p-0">
        {/* Loading */}
        {isPending && (
          <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-[#1D5FAD] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium">Memuat pelamar...</p>
          </div>
        )}

        {/* Empty */}
        {!isPending && data?.data.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center">
              <Users className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-400">
              Belum ada pelamar.
            </p>
          </div>
        )}

        {/* Rows */}
        <div className="divide-y divide-[#F0F5FB]">
          {data?.data.map((applicant) => (
            <ApplicantRow
              key={applicant.id}
              applicant={applicant}
              jobId={jobId}
              onViewDetail={() => setSelectedId(applicant.id)}
            />
          ))}
        </div>

        {/* Pagination */}
        {!!data?.meta && (
          <div className="px-6 py-2 border-t border-[#E2EAF4]">
            <PaginationSection
              meta={data.meta}
              onChangePage={(p) => setPage(p)}
            />
          </div>
        )}
      </CardContent>

      {/* Detail Dialog */}
      {selectedId && (
        <ApplicantDetailDialog
          applicationId={selectedId}
          jobId={jobId}
          open={!!selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </Card>
  );
}

// ════════════════════════════════════════════════
// ApplicantRow
// ════════════════════════════════════════════════
function ApplicantRow({
  applicant,
  jobId,
  onViewDetail,
}: {
  applicant: Application;
  jobId: number;
  onViewDetail: () => void;
}) {
  // ── hooks — identik ──
  const { mutate: updateStatus, isPending } = useUpdateApplicantStatus(
    applicant.id,
    jobId,
  );
  const { mutate: createInterview, isPending: isCreatingInterview } =
    useCreateInterview(jobId);

  // ── state — identik ──
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [locationLink, setLocationLink] = useState("");

  // ── logic — identik ──
  const nextStatuses = allowedTransitions[applicant.status];
  const canSchedule = applicant.status === "INTERVIEW";
  const cfg = statusConfig[applicant.status];

  const handleStatusChange = (v: string) => {
    if (v === "REJECTED") {
      setShowRejectDialog(true);
    } else {
      updateStatus({ status: v as Exclude<ApplicationStatus, "PENDING"> });
    }
  };

  const handleRejectConfirm = () => {
    if (!rejectionReason.trim()) return;
    updateStatus({ status: "REJECTED", rejectionReason });
    setShowRejectDialog(false);
    setRejectionReason("");
  };

  const handleScheduleConfirm = () => {
    if (!interviewDate) return;
    createInterview({
      applicationId: applicant.id,
      interviewDate,
      locationLink: locationLink || undefined,
    });
    setShowScheduleDialog(false);
    setInterviewDate("");
    setLocationLink("");
  };

  return (
    <>
      <div className="group flex items-center gap-4 px-6 py-4 hover:bg-[#F8FAFD] transition-colors">
        {/* Avatar */}
        <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-white shadow-sm">
          <AvatarImage src={applicant.user.profilePhoto ?? undefined} />
          <AvatarFallback className="bg-[#EFF6FF] text-[#1D5FAD] font-bold text-xs">
            {applicant.user.fullName?.[0] ??
              applicant.user.email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Name + email */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0F2342] truncate leading-snug">
            {applicant.user.fullName ?? "—"}
          </p>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            {applicant.user.email}
          </p>
        </div>

        {/* Test score */}
        <div className="hidden sm:flex flex-col items-center w-20 flex-shrink-0">
          {applicant.testResult ? (
            <>
              <span className="text-base font-bold text-[#0F2342]">
                {Number(applicant.testResult.score).toFixed(0)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                skor
              </span>
            </>
          ) : (
            <span className="text-[11px] text-slate-300 font-medium">—</span>
          )}
        </div>

        {/* Status select or badge */}
        <div className="flex-shrink-0 w-32">
          {nextStatuses.length > 0 ? (
            <Select
              value={applicant.status}
              onValueChange={handleStatusChange}
              disabled={isPending}
            >
              <SelectTrigger className="h-8 w-full rounded-lg border-[#D1DFF0] bg-white text-xs focus:ring-[#1D5FAD]/20 gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full flex-shrink-0",
                      cfg.dot,
                    )}
                  />
                  <span className="font-semibold text-[#0F2342]">
                    {cfg.label}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {nextStatuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold",
                cfg.badge,
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
              {cfg.label}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {canSchedule && (
            <Button
              variant="ghost"
              size="icon"
              title="Jadwalkan Interview"
              disabled={isCreatingInterview}
              onClick={() => setShowScheduleDialog(true)}
              className="h-8 w-8 rounded-lg text-amber-500 hover:text-amber-600 hover:bg-amber-50"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            title="Lihat Detail"
            onClick={onViewDetail}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-[#1D5FAD] hover:bg-[#EFF6FF]"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Lihat CV"
            onClick={() => {
              const base =
                import.meta.env.VITE_BASE_URL_API || "http://localhost:8000";
              window.open(`${base}/cvs/${applicant.cv.id}/file`, "_blank");
            }}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-[#1D5FAD] hover:bg-[#EFF6FF]"
          >
            <FileText className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Rejection Dialog — logic identik ── */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-[#0F2342]">
              Tolak Pelamar?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-sm">
              Masukkan alasan penolakan untuk pelamar ini. Alasan akan
              dikirimkan kepada pelamar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Contoh: Kualifikasi tidak sesuai dengan kebutuhan posisi..."
            className="w-full h-24 rounded-xl border border-[#D1DFF0] bg-[#F4F8FF] p-3 text-sm resize-none focus:outline-none focus:border-[#1D5FAD] focus:ring-2 focus:ring-[#1D5FAD]/10 transition-colors"
          />
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-xl text-xs font-semibold border-[#D1DFF0]"
              onClick={() => {
                setRejectionReason("");
                setShowRejectDialog(false);
              }}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim()}
              className="bg-rose-500 hover:bg-rose-600 rounded-xl text-xs font-semibold disabled:opacity-50"
            >
              Ya, Tolak
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Schedule Interview Dialog — logic identik ── */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent
          className="rounded-2xl max-w-sm"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <CalendarPlus className="w-4 h-4 text-amber-500" />
              </div>
              <DialogTitle className="font-bold text-[#0F2342]">
                Jadwalkan Interview
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                Tanggal & Waktu <span className="text-rose-400">*</span>
              </p>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#D1DFF0] bg-[#F4F8FF] px-3 text-sm font-medium text-[#0F2342] focus:outline-none focus:border-[#1D5FAD] focus:ring-2 focus:ring-[#1D5FAD]/10 transition-colors"
              />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                Link / Lokasi <span className="text-slate-300">(opsional)</span>
              </p>
              <Input
                value={locationLink}
                onChange={(e) => setLocationLink(e.target.value)}
                placeholder="https://meet.google.com/... atau nama gedung"
                className="h-10 rounded-xl border-[#D1DFF0] bg-[#F4F8FF] text-sm focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD]"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1 rounded-xl text-xs font-semibold border-[#D1DFF0] text-slate-500 hover:bg-[#F4F8FF]"
                onClick={() => setShowScheduleDialog(false)}
              >
                Batal
              </Button>
              <Button
                onClick={handleScheduleConfirm}
                disabled={!interviewDate || isCreatingInterview}
                className="flex-1 bg-[#1D5FAD] hover:bg-[#174E8F] text-white rounded-xl text-xs font-semibold disabled:opacity-50"
              >
                {isCreatingInterview ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan Jadwal"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
