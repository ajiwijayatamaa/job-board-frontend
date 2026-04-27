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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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

const statusConfig: Record<
  ApplicationStatus,
  { label: string; class: string }
> = {
  PENDING: { label: "Pending", class: "bg-zinc-100 text-zinc-500" },
  PROCESSED: { label: "Diproses", class: "bg-blue-50 text-blue-600" },
  INTERVIEW: { label: "Interview", class: "bg-yellow-50 text-yellow-600" },
  ACCEPTED: { label: "Diterima", class: "bg-emerald-50 text-emerald-600" },
  REJECTED: { label: "Ditolak", class: "bg-red-50 text-red-500" },
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
    <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
      <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
        <CardTitle className="flex items-center gap-2 text-sm font-black uppercase italic tracking-tight text-zinc-900">
          <Users className="w-4 h-4 text-orange-500" />
          Daftar Pelamar
          {data?.meta.total !== undefined && (
            <span className="ml-auto text-xs font-bold text-zinc-400">
              {data.meta.total} pelamar
            </span>
          )}
        </CardTitle>
      </CardHeader>

      {/* Filters */}
      <div className="px-6 py-4 flex flex-wrap gap-3 border-b border-zinc-50">
        <div className="relative flex-1 min-w-[200px]">
          <Input
            placeholder="Cari nama pelamar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl border-zinc-200 text-sm"
          />
        </div>
        <Select
          value={education || "all"}
          onValueChange={(v) => setEducation(v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-10 w-[180px] rounded-xl border-zinc-200 text-sm">
            <span>{education || "Semua Pendidikan"}</span>
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

      <CardContent className="p-0">
        {isPending && (
          <div className="py-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!isPending && data?.data.length === 0 && (
          <div className="py-12 text-center text-zinc-400">
            <Users className="w-8 h-8 mx-auto mb-2 text-zinc-200" />
            <p className="text-sm font-bold">Belum ada pelamar.</p>
          </div>
        )}
        <div className="divide-y divide-zinc-50">
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
      </CardContent>

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

  // tampilkan tombol jadwalkan jika status INTERVIEW dan belum ada jadwal
  const canSchedule = applicant.status === "INTERVIEW";

  return (
    <>
      <div className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/50 transition-colors">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={applicant.user.profilePhoto ?? undefined} />
          <AvatarFallback className="bg-orange-100 text-orange-600 font-black text-xs">
            {applicant.user.fullName?.[0] ??
              applicant.user.email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-zinc-900 truncate">
            {applicant.user.fullName ?? "—"}
          </p>
          <p className="text-[10px] text-zinc-400 font-medium truncate">
            {applicant.user.email}
          </p>
        </div>

        {applicant.testResult && (
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-zinc-900">
              Skor:{" "}
              <span className="text-orange-500">
                {Number(applicant.testResult.score).toFixed(0)}
              </span>
            </p>
          </div>
        )}

        {/* Status Select atau Badge */}
        {nextStatuses.length > 0 ? (
          <Select
            value={applicant.status}
            onValueChange={handleStatusChange}
            disabled={isPending}
          >
            <SelectTrigger className="h-8 w-[130px] rounded-xl border-zinc-200">
              <Badge
                className={cn(
                  "text-[9px] font-black uppercase",
                  statusConfig[applicant.status].class,
                )}
              >
                {statusConfig[applicant.status].label}
              </Badge>
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
          <Badge
            className={cn(
              "text-[9px] font-black uppercase h-8 px-3",
              statusConfig[applicant.status].class,
            )}
          >
            {statusConfig[applicant.status].label}
          </Badge>
        )}

        {/* Tombol Jadwalkan Interview */}
        {canSchedule && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
            title="Jadwalkan Interview"
            disabled={isCreatingInterview}
            onClick={() => setShowScheduleDialog(true)}
          >
            <CalendarPlus className="w-4 h-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={onViewDetail}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={() => {
            const base =
              import.meta.env.VITE_BASE_URL_API || "http://localhost:8000";
            window.open(`${base}/cvs/${applicant.cv.id}/file`, "_blank");
          }}
        >
          <FileText className="w-4 h-4" />
        </Button>
      </div>

      {/* Rejection Reason Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase italic">
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
            className="w-full h-24 rounded-xl border border-zinc-200 p-3 text-sm font-medium resize-none focus:outline-none focus:border-orange-500"
          />
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-xl font-black uppercase text-[10px]"
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
              className="bg-red-500 hover:bg-red-600 rounded-xl font-black uppercase text-[10px]"
            >
              Ya, Tolak
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent
          className="rounded-[2rem] max-w-sm"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="font-black uppercase italic text-zinc-900">
              Jadwalkan Interview
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
                onClick={() => setShowScheduleDialog(false)}
              >
                Batal
              </Button>
              <Button
                onClick={handleScheduleConfirm}
                disabled={!interviewDate || isCreatingInterview}
                className="flex-1 bg-zinc-900 hover:bg-black text-white rounded-2xl font-black uppercase text-[10px]"
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
