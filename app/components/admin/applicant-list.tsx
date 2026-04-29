import { CalendarPlus, Eye, FileText, Users } from "lucide-react";
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
  SelectValue,
} from "~/components/ui/select";
import useCreateInterview from "~/hooks/api/useCreateInterview";
import useGetApplicants from "~/hooks/api/useGetApplicants";
import useUpdateApplicantStatus from "~/hooks/api/useUpdateApplicantStatus";
import { cn } from "~/lib/utils";
import type { Application, ApplicationStatus } from "~/types/application";
import ApplicantDetailDialog from "./applicant-detail-dialog";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; class: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    class: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    dot: "bg-slate-400",
  },
  PROCESSED: {
    label: "Diproses",
    class: "bg-blue-50 text-blue-600 ring-1 ring-blue-200",
    dot: "bg-blue-400",
  },
  INTERVIEW: {
    label: "Interview",
    class: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
    dot: "bg-amber-400",
  },
  ACCEPTED: {
    label: "Diterima",
    class: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
    dot: "bg-teal-400",
  },
  REJECTED: {
    label: "Ditolak",
    class: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
    dot: "bg-rose-400",
  },
};

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

export default function ApplicantList({ jobId }: { jobId: number }) {
  const [page, setPage] = useQueryState(
    "applicantPage",
    parseAsInteger.withDefault(1),
  );
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [education, setEducation] = useQueryState("education", {
    defaultValue: "",
  });
  const [minAge, setMinAge] = useQueryState("minAge", parseAsInteger);
  const [maxAge, setMaxAge] = useQueryState("maxAge", parseAsInteger);
  const [minSalary, setMinSalary] = useQueryState("minSalary", parseAsInteger);
  const [maxSalary, setMaxSalary] = useQueryState("maxSalary", parseAsInteger);

  const [debouncedSearch] = useDebounceValue(search, 500);
  const [debouncedMinAge] = useDebounceValue(minAge, 500);
  const [debouncedMaxAge] = useDebounceValue(maxAge, 500);
  const [debouncedMinSalary] = useDebounceValue(minSalary, 500);
  const [debouncedMaxSalary] = useDebounceValue(maxSalary, 500);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isPending } = useGetApplicants(jobId, {
    page,
    take: 10,
    search: debouncedSearch,
    education: education || undefined,
    minAge: debouncedMinAge || undefined,
    maxAge: debouncedMaxAge || undefined,
    minExpectedSalary: debouncedMinSalary || undefined,
    maxExpectedSalary: debouncedMaxSalary || undefined,
    sortBy: "appliedAt",
    sortOrder: "asc",
  });

  return (
    <div className="bg-white border border-[#E2EAF4] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E2EAF4] bg-[#F4F8FF] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1D5FAD] flex items-center justify-center flex-shrink-0">
            <Users className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-[#0F2342]">
            Daftar Pelamar
          </span>
        </div>
        {data?.meta.total !== undefined && (
          <span className="text-xs font-semibold text-slate-400 bg-white border border-[#E2EAF4] px-3 py-1 rounded-full">
            {data.meta.total} pelamar
          </span>
        )}
      </div>

      {/* Filters */}
      {/* Filters Section */}
      <div className="px-6 py-4 flex flex-col gap-4 border-b border-[#E2EAF4] bg-white">
        {/* Baris 1: Pencarian & Pendidikan */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Cari nama pelamar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-xl border-[#D1DFF0] text-sm focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD]"
            />
          </div>

          <Select
            value={education || "all"}
            onValueChange={(v) => setEducation(v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-10 w-[180px] rounded-xl border-[#D1DFF0] text-sm">
              <SelectValue placeholder="Semua Pendidikan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Pendidikan</SelectItem>
              <SelectItem value="SMA">SMA/SMK</SelectItem>
              <SelectItem value="D3">D3</SelectItem>
              <SelectItem value="S1">S1</SelectItem>
              <SelectItem value="S2">S2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Baris 2: Usia & Gaji */}
        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-dashed border-slate-100">
          {/* Filter Usia */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Usia:
            </span>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                placeholder="Min"
                value={minAge ?? ""}
                onChange={(e) =>
                  setMinAge(e.target.value ? parseInt(e.target.value) : null)
                }
                className="h-8 w-16 rounded-lg border-[#D1DFF0] text-xs px-2"
              />
              <span className="text-slate-300">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxAge ?? ""}
                onChange={(e) =>
                  setMaxAge(e.target.value ? parseInt(e.target.value) : null)
                }
                className="h-8 w-16 rounded-lg border-[#D1DFF0] text-xs px-2"
              />
            </div>
          </div>

          {/* Filter Gaji */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Gaji (IDR):
            </span>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                placeholder="Gaji Min"
                value={minSalary ?? ""}
                onChange={(e) =>
                  setMinSalary(e.target.value ? parseInt(e.target.value) : null)
                }
                className="h-8 w-28 rounded-lg border-[#D1DFF0] text-xs px-2"
              />
              <span className="text-slate-300">to</span>
              <Input
                type="number"
                placeholder="Gaji Max"
                value={maxSalary ?? ""}
                onChange={(e) =>
                  setMaxSalary(e.target.value ? parseInt(e.target.value) : null)
                }
                className="h-8 w-28 rounded-lg border-[#D1DFF0] text-xs px-2"
              />
            </div>
          </div>

          {/* Reset Button */}
          {(minAge || maxAge || minSalary || maxSalary || education) && (
            <Button
              variant="ghost"
              className="h-8 text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2 ml-auto"
              onClick={() => {
                setMinAge(null);
                setMaxAge(null);
                setMinSalary(null);
                setMaxSalary(null);
                setEducation(null);
              }}
            >
              RESET FILTER
            </Button>
          )}
        </div>
      </div>
      {/* End of Filters */}

      {/* Content */}
      <div>
        {isPending && (
          <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-[#1D5FAD] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium">Memuat pelamar...</p>
          </div>
        )}
        {!isPending && data?.data.length === 0 && (
          <div className="py-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Users className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Belum ada pelamar.
            </p>
          </div>
        )}
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
        {!!data?.meta && (
          <div className="px-6">
            <PaginationSection
              meta={data.meta}
              onChangePage={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {selectedId && (
        <ApplicantDetailDialog
          applicationId={selectedId}
          jobId={jobId}
          open={!!selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

function ApplicantRow({
  applicant,
  jobId,
  onViewDetail,
}: {
  applicant: Application;
  jobId: number;
  onViewDetail: () => void;
}) {
  const { mutate: updateStatus, isPending } = useUpdateApplicantStatus(
    applicant.id,
    jobId,
  );
  const { mutate: createInterview, isPending: isCreatingInterview } =
    useCreateInterview(jobId);

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [locationLink, setLocationLink] = useState("");

  const nextStatuses = allowedTransitions[applicant.status];

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

  const canSchedule = applicant.status === "INTERVIEW";

  return (
    <>
      <div className="flex items-center gap-4 px-6 py-4 hover:bg-[#F4F8FF] transition-colors group">
        <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-[#E2EAF4]">
          <AvatarImage src={applicant.user.profilePhoto ?? undefined} />
          <AvatarFallback className="bg-[#1D5FAD]/10 text-[#1D5FAD] font-bold text-xs">
            {applicant.user.fullName?.[0] ??
              applicant.user.email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0F2342] truncate">
            {applicant.user.fullName ?? "—"}
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            {applicant.user.email}
          </p>
        </div>

        {applicant.testResult && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg">
            <span className="text-[10px] font-semibold text-indigo-500">
              Skor
            </span>
            <span className="text-[11px] font-bold text-indigo-700">
              {Number(applicant.testResult.score).toFixed(0)}
            </span>
          </div>
        )}

        {/* Status Select atau Badge */}
        {nextStatuses.length > 0 ? (
          <Select
            value={applicant.status}
            onValueChange={handleStatusChange}
            disabled={isPending}
          >
            <SelectTrigger className="h-8 w-[130px] rounded-xl border-[#D1DFF0] bg-white">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    statusConfig[applicant.status].dot,
                  )}
                />
                <span className="text-[10px] font-semibold text-slate-600">
                  {statusConfig[applicant.status].label}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent position="popper">
              {nextStatuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold",
              statusConfig[applicant.status].class,
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                statusConfig[applicant.status].dot,
              )}
            />
            {statusConfig[applicant.status].label}
          </div>
        )}

        {/* Tombol Jadwalkan Interview */}
        {canSchedule && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0 rounded-xl text-amber-500 hover:text-amber-600 hover:bg-amber-50 border border-amber-200"
            title="Jadwalkan Interview"
            disabled={isCreatingInterview}
            onClick={() => setShowScheduleDialog(true)}
          >
            <CalendarPlus className="w-3.5 h-3.5" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0 rounded-xl hover:bg-[#EEF4FF] hover:text-[#1D5FAD] text-slate-400 transition-colors"
          onClick={onViewDetail}
        >
          <Eye className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0 rounded-xl hover:bg-teal-50 hover:text-teal-600 text-slate-400 transition-colors"
          onClick={() => {
            const base =
              import.meta.env.VITE_BASE_URL_API || "http://localhost:8000";
            window.open(`${base}/cvs/${applicant.cv.id}/file`, "_blank");
          }}
        >
          <FileText className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Rejection Reason Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-[#0F2342]">
              Tolak Pelamar?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Masukkan alasan penolakan untuk pelamar ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Contoh: Kualifikasi tidak sesuai dengan kebutuhan posisi..."
            className="w-full h-24 rounded-xl border border-[#D1DFF0] p-3 text-sm resize-none focus:outline-none focus:border-[#1D5FAD]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-xl text-xs font-semibold"
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
              className="bg-rose-500 hover:bg-rose-600 rounded-xl text-xs font-semibold"
            >
              Ya, Tolak
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent
          className="rounded-2xl max-w-sm"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="font-bold text-[#0F2342]">
              Jadwalkan Interview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Tanggal & Waktu *
              </p>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#D1DFF0] px-3 text-sm focus:outline-none focus:border-[#1D5FAD]"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Link / Lokasi (opsional)
              </p>
              <Input
                value={locationLink}
                onChange={(e) => setLocationLink(e.target.value)}
                placeholder="https://meet.google.com/... atau nama gedung"
                className="h-10 rounded-xl border-[#D1DFF0] text-sm focus-visible:border-[#1D5FAD]"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl text-xs font-semibold border-[#D1DFF0]"
                onClick={() => setShowScheduleDialog(false)}
              >
                Batal
              </Button>
              <Button
                onClick={handleScheduleConfirm}
                disabled={!interviewDate || isCreatingInterview}
                className="flex-1 bg-[#1D5FAD] hover:bg-[#174E8F] text-white rounded-xl text-xs font-semibold"
              >
                {isCreatingInterview ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
