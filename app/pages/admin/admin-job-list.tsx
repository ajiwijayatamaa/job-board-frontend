import {
  Briefcase,
  Calendar,
  ChevronRight,
  MapPin,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Users,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Link, redirect, useNavigate } from "react-router";
import { useDebounceValue } from "usehooks-ts";
import AdminSidebar from "~/components/admin/admin-sidebar";
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
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { SidebarProvider } from "~/components/ui/sidebar";
import useDeleteJob from "~/hooks/api/useDeleteJob";
import useGetAdminJobs from "~/hooks/api/useGetAdminJobs";
import useUpdateJobStatus from "~/hooks/api/useUpdateJobStatus";
import { cn } from "~/lib/utils";
import { useAuth } from "~/stores/useAuth";
import type { Job } from "~/types/job";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ADMIN") return redirect("/");
};

// ── hanya class yang beda ──
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

const JobCard = ({ job }: { job: Job }) => {
  const navigate = useNavigate();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateJobStatus(
    job.id,
  );
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();

  // ── logic identik dengan original ──
  const toggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateStatus(job.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED");
  };

  const isExpiringSoon =
    new Date(job.deadline).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

  return (
    <Card
      onClick={() => navigate(`/admin/jobs/${job.id}`)}
      className="group overflow-hidden border border-[#E2EAF4] shadow-none hover:shadow-lg hover:shadow-slate-100 hover:border-[#A5C0E4] transition-all duration-300 rounded-2xl bg-white cursor-pointer"
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* ── Banner — data binding identik ── */}
          <div className="w-full md:w-44 h-40 md:h-auto shrink-0 relative overflow-hidden bg-slate-100">
            {job.banner ? (
              <img
                src={job.banner}
                alt={job.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <Briefcase className="w-10 h-10 text-slate-300" />
              </div>
            )}
            {/* status pill — di atas banner */}
            <div
              className={cn(
                "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold",
                statusConfig[job.status].class,
              )}
            >
              {statusConfig[job.status].label}
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="p-5 md:p-6 flex-1 flex flex-col justify-between min-w-0 border-r border-dashed border-[#E2EAF4]">
            <div className="mb-4">
              <h3 className="text-base font-bold text-[#0F2342] group-hover:text-[#1D5FAD] transition-colors truncate leading-snug">
                {job.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {job.category}
              </p>
            </div>

            {/* info pills — identik, hanya className beda */}
            <div className="flex flex-wrap gap-2 mb-5">
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
                    isExpiringSoon ? "text-amber-500" : "text-[#1D5FAD]",
                  )}
                />
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    isExpiringSoon ? "text-amber-700" : "text-slate-600",
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
                  <span className="text-[11px] font-semibold text-indigo-600">
                    Pre-test
                  </span>
                </div>
              )}
            </div>

            {/* Actions — logic identik */}
            <div
              className="flex flex-wrap gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={toggleStatus}
                disabled={isUpdating}
                className={cn(
                  "rounded-lg h-8 text-xs font-semibold transition-all",
                  job.status === "PUBLISHED"
                    ? "border-slate-200 text-slate-600 hover:bg-slate-50"
                    : "border-teal-200 text-teal-700 hover:bg-teal-50",
                )}
              >
                {job.status === "PUBLISHED" ? (
                  <>
                    <ToggleRight size={13} className="mr-1" /> Nonaktifkan
                  </>
                ) : (
                  <>
                    <ToggleLeft size={13} className="mr-1" /> Aktifkan
                  </>
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isDeleting}
                    className="rounded-lg h-8 text-xs font-semibold border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all"
                  >
                    <Trash2 size={12} className="mr-1" /> Hapus
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
                      onClick={() => deleteJob(job.id)}
                      className="bg-rose-500 hover:bg-rose-600 rounded-xl text-xs font-semibold"
                    >
                      Ya, Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* ── Stats Panel — identik ── */}
          <div className="md:w-40 bg-[#F4F8FF] p-6 flex flex-col justify-center items-center gap-3 border-t md:border-t-0 md:border-l border-dashed border-[#C8D9EE]">
            <div className="text-center">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">
                Total Pelamar
              </p>
              <div className="flex items-end justify-center gap-1">
                <p className="text-3xl font-bold text-[#0F2342]">
                  {job._count.applications}
                </p>
                <Users size={13} className="text-slate-300 mb-1.5" />
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#1D5FAD] group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AdminJobListPage() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [category, setCategory] = useQueryState("category", {
    defaultValue: "",
  });
  const [debouncedSearch] = useDebounceValue(search, 500);
  const [debouncedCategory] = useDebounceValue(category, 500);

  const {
    data: jobs,
    isPending,
    isError,
  } = useGetAdminJobs({
    page,
    take: 10,
    search: debouncedSearch,
    category: debouncedCategory,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F0F5FB] w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-10">
          {/* ── Header ── */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {/* Logo mark */}
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
                  Manajemen Lowongan
                </span>
              </div>
              <h1 className="text-3xl font-bold text-[#0F2342]">
                Job Postings
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Kelola semua lowongan pekerjaan yang telah dibuat.
              </p>
            </div>
            <Button
              asChild
              className="bg-[#1D5FAD] hover:bg-[#174E8F] text-white rounded-xl h-11 px-5 font-semibold text-sm"
            >
              <Link to="/admin/jobs/create">
                <Plus className="mr-2 h-4 w-4" /> Buat Lowongan
              </Link>
            </Button>
          </div>

          {/* ── Search ── */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                className="pl-10 h-11 bg-white border-[#D1DFF0] rounded-xl text-sm focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD]"
                type="text"
                placeholder="Cari judul lowongan..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
            <div className="relative flex-1">
              <Input
                className="h-11 bg-white border-[#D1DFF0] rounded-xl text-sm focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD]"
                type="text"
                placeholder="Filter kategori..."
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              />
            </div>
          </div>

          {/* ── List ── */}
          <div className="space-y-4">
            {isPending && (
              <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
                <div className="w-7 h-7 border-2 border-[#1D5FAD] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium">Memuat lowongan...</p>
              </div>
            )}

            {isError && (
              <div className="text-center py-16 bg-rose-50 rounded-2xl border border-rose-100">
                <p className="text-rose-500 text-sm font-semibold">
                  Gagal memuat data lowongan.
                </p>
              </div>
            )}

            {jobs?.data.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

            {!isPending && jobs?.data.length === 0 && (
              <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-[#C8D9EE]">
                <Briefcase className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm font-medium">
                  Belum ada lowongan yang dibuat.
                </p>
              </div>
            )}
          </div>

          {/* ── Pagination ── */}
          <div className="mt-10">
            {!!jobs?.meta && (
              <PaginationSection
                meta={jobs.meta}
                onChangePage={(page) => setPage(page)}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
