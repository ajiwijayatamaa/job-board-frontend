import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Calendar,
  CalendarClock,
  ClipboardList,
  MapPin,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { Link, redirect, useParams } from "react-router";
import AdminSidebar from "~/components/admin/admin-sidebar";
import ApplicantList from "~/components/admin/applicant-list";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { SidebarProvider } from "~/components/ui/sidebar";
import useDeleteJob from "~/hooks/api/useDeleteJob";
import useGetAdminJobById from "~/hooks/api/useGetAdminJobById";
import useGetTestByJobId from "~/hooks/api/useGetTestByJobId";
import useUpdateJobStatus from "~/hooks/api/useUpdateJobStatus";
import { cn } from "~/lib/utils";
import { useAuth } from "~/stores/useAuth";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ADMIN") return redirect("/");
};

// ── Design tokens — identik dengan admin-overview & admin-job-list ──
const statusConfig = {
  PUBLISHED: {
    label: "Aktif",
    class: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
  },
  DRAFT: {
    label: "Draft",
    class: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  },
  CLOSED: {
    label: "Ditutup",
    class: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
  },
};

export default function AdminJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  // ── hooks — identik dengan original ──
  const { data: job, isLoading } = useGetAdminJobById(numericId);
  const { data: existingTest } = useGetTestByJobId(numericId);
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateJobStatus(numericId);
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F0F5FB]">
        <div className="w-7 h-7 border-2 border-[#1D5FAD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) return null;

  const isExpiringSoon =
    new Date(job.deadline).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F0F5FB] w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto space-y-6"
          >
            {/* ── Back button — sama pattern dengan admin-job-list ── */}
            <Button
              variant="ghost"
              asChild
              className="text-slate-400 hover:text-[#0F2342] font-semibold text-xs uppercase tracking-widest -ml-2"
            >
              <Link to="/admin/jobs">
                <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Kembali ke Lowongan
              </Link>
            </Button>

            {/* ── Page header — sama pattern dengan admin-overview & admin-job-list ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {/* Logo mark — identik dengan admin-overview & admin-job-list */}
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
                    Detail Lowongan
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-[#0F2342]">
                  {job.title}
                </h1>
                <p className="text-slate-500 text-sm mt-1">{job.category}</p>
              </div>

              {/* Status badge di header */}
              <span
                className={cn(
                  "self-start md:self-auto px-3 py-1.5 rounded-full text-[11px] font-semibold",
                  statusConfig[job.status].class,
                )}
              >
                {statusConfig[job.status].label}
              </span>
            </div>

            {/* ── Job Info Card — mengikuti card pattern admin-job-list ── */}
            <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Banner — identik dengan JobCard di admin-job-list */}
                  <div className="w-full md:w-56 h-48 md:h-auto shrink-0 relative overflow-hidden bg-slate-100">
                    {job.banner ? (
                      <img
                        src={job.banner}
                        alt={job.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <Briefcase className="w-10 h-10 text-slate-300" />
                      </div>
                    )}
                    {/* Status pill di atas banner — sama dengan JobCard */}
                    <div
                      className={cn(
                        "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold",
                        statusConfig[job.status].class,
                      )}
                    >
                      {statusConfig[job.status].label}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-5">
                    {/* Info pills — sama pola dengan JobCard */}
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <MapPin size={11} className="text-[#1D5FAD] shrink-0" />
                        <span className="text-[11px] font-medium text-slate-600">
                          {job.city}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border",
                          isExpiringSoon
                            ? "bg-amber-50 border-amber-200"
                            : "bg-slate-50 border-slate-200",
                        )}
                      >
                        <Calendar
                          size={11}
                          className={cn(
                            "shrink-0",
                            isExpiringSoon
                              ? "text-amber-500"
                              : "text-[#1D5FAD]",
                          )}
                        />
                        <span
                          className={cn(
                            "text-[11px] font-medium",
                            isExpiringSoon
                              ? "text-amber-700"
                              : "text-slate-600",
                          )}
                        >
                          {new Date(job.deadline).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {isExpiringSoon && (
                          <span className="text-[10px] font-bold text-amber-500 ml-0.5">
                            · Segera!
                          </span>
                        )}
                      </div>

                      {job.salary && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg">
                          <span className="text-[11px] font-semibold text-teal-700">
                            Rp {Number(job.salary).toLocaleString("id-ID")}
                          </span>
                          <span className="text-[10px] text-teal-500 font-normal">
                            /bln
                          </span>
                        </div>
                      )}

                      {job.preTest && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg">
                          <ClipboardList
                            size={11}
                            className="text-indigo-500 shrink-0"
                          />
                          <span className="text-[11px] font-semibold text-indigo-600">
                            Pre-test Aktif
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-lg bg-[#F4F8FF] border border-[#E2EAF4] text-[10px] font-semibold text-slate-500 uppercase tracking-wide"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description preview */}
                    {job.description && (
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {job.description}
                      </p>
                    )}

                    {/* ── Action Buttons — logic identik dengan original ── */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {/* Edit */}
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-xl h-9 text-xs font-semibold border-[#D1DFF0] text-slate-600 hover:bg-[#F0F5FB] hover:border-[#A5C0E4]"
                      >
                        <Link to={`/admin/jobs/${id}/edit`}>
                          <Pencil size={12} className="mr-1.5" /> Edit Lowongan
                        </Link>
                      </Button>

                      {/* Toggle publish */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateStatus(
                            job.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
                          )
                        }
                        disabled={isUpdating}
                        className={cn(
                          "rounded-xl h-9 text-xs font-semibold transition-all",
                          job.status === "PUBLISHED"
                            ? "border-slate-200 text-slate-600 hover:bg-slate-50"
                            : "border-teal-200 text-teal-700 hover:bg-teal-50",
                        )}
                      >
                        {job.status === "PUBLISHED" ? (
                          <>
                            <ToggleRight size={13} className="mr-1.5" />{" "}
                            Nonaktifkan
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={13} className="mr-1.5" /> Aktifkan
                          </>
                        )}
                      </Button>

                      {/* Pre-Selection Test buttons — logic identik dengan original */}
                      {job.preTest ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="rounded-xl h-9 text-xs font-semibold border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                          >
                            <Link
                              to={`/admin/jobs/${id}/pre-selection-test/edit`}
                            >
                              <ClipboardList size={12} className="mr-1.5" />{" "}
                              Edit Test
                            </Link>
                          </Button>
                          {existingTest && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="rounded-xl h-9 text-xs font-semibold border-[#D1DFF0] text-slate-600 hover:bg-[#F0F5FB] hover:border-[#A5C0E4]"
                            >
                              <Link
                                to={`/admin/pre-selection-tests/${existingTest.id}/results`}
                              >
                                <Award size={12} className="mr-1.5" /> Hasil
                                Test
                              </Link>
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="rounded-xl h-9 text-xs font-semibold border-[#D1DFF0] text-[#1D5FAD] hover:bg-[#EFF6FF] hover:border-[#A5C0E4]"
                        >
                          <Link
                            to={`/admin/jobs/${id}/pre-selection-test/create`}
                          >
                            <ClipboardList size={12} className="mr-1.5" /> Buat
                            Test
                          </Link>
                        </Button>
                      )}

                      {/* Interview schedule */}
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-xl h-9 text-xs font-semibold border-[#D1DFF0] text-slate-600 hover:bg-[#F0F5FB] hover:border-[#A5C0E4]"
                      >
                        <Link to={`/admin/jobs/${id}/interviews`}>
                          <CalendarClock size={12} className="mr-1.5" /> Jadwal
                          Interview
                        </Link>
                      </Button>

                      {/* Delete — identik dengan JobCard di admin-job-list */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isDeleting}
                            className="rounded-xl h-9 text-xs font-semibold border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all"
                          >
                            <Trash2 size={12} className="mr-1.5" /> Hapus
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-bold text-[#0F2342]">
                              Hapus lowongan ini?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Lowongan <strong>{job.title}</strong> akan dihapus
                              permanen. Tindakan ini tidak bisa dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl text-xs font-semibold">
                              Batal
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteJob(numericId)}
                              className="bg-rose-500 hover:bg-rose-600 rounded-xl text-xs font-semibold"
                            >
                              Ya, Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* ── Stats Panel — sama pola dengan JobCard di admin-job-list ── */}
                  <div className="md:w-44 bg-[#F4F8FF] p-6 flex flex-col justify-center items-center gap-4 border-t md:border-t-0 md:border-l border-dashed border-[#C8D9EE]">
                    <div className="text-center">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">
                        Total Pelamar
                      </p>
                      <p className="text-4xl font-bold text-[#0F2342]">
                        {job._count?.applications ?? 0}
                      </p>
                    </div>

                    <div className="w-full h-px bg-[#C8D9EE]" />

                    <div className="text-center">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">
                        Status
                      </p>
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-semibold",
                          statusConfig[job.status].class,
                        )}
                      >
                        {statusConfig[job.status].label}
                      </span>
                    </div>

                    {job.preTest && (
                      <>
                        <div className="w-full h-px bg-[#C8D9EE]" />
                        <div className="text-center">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                            Pre-Test
                          </p>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200">
                            Aktif
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── Applicant List — identik dengan original ── */}
            <ApplicantList jobId={numericId} />
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
}
