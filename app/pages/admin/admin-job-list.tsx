import {
  Briefcase,
  Calendar,
  ChevronRight,
  MapPin,
  Plus,
  Search,
  Sparkles,
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

const statusConfig = {
  PUBLISHED: { label: "Published", class: "bg-emerald-50 text-emerald-600" },
  DRAFT: { label: "Draft", class: "bg-zinc-100 text-zinc-500" },
  CLOSED: { label: "Closed", class: "bg-red-50 text-red-500" },
};

const JobCard = ({ job }: { job: Job }) => {
  const navigate = useNavigate();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateJobStatus(
    job.id,
  );
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();

  const toggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateStatus(job.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED");
  };

  const isExpiringSoon =
    new Date(job.deadline).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

  return (
    <Card
      onClick={() => navigate(`/admin/jobs/${job.id}`)}
      className="group overflow-hidden border-none shadow-sm hover:shadow-xl hover:shadow-zinc-200 transition-all duration-300 rounded-[2rem] bg-white cursor-pointer relative"
    >
      {/* punch holes */}
      <div className="absolute top-1/2 -left-3 w-6 h-6 bg-zinc-50 rounded-full border border-zinc-100 -translate-y-1/2 hidden md:block" />
      <div className="absolute top-1/2 -right-3 w-6 h-6 bg-zinc-50 rounded-full border border-zinc-100 -translate-y-1/2 hidden md:block" />

      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* ── Banner ── */}
          <div className="w-full md:w-48 h-40 md:h-auto shrink-0 relative overflow-hidden bg-zinc-100">
            {job.banner ? (
              <img
                src={job.banner}
                alt={job.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-zinc-300" />
              </div>
            )}
            {/* status pill */}
            <div
              className={cn(
                "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                statusConfig[job.status].class,
              )}
            >
              {statusConfig[job.status].label}
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="p-6 md:p-7 flex-1 flex flex-col justify-between border-r border-dashed border-zinc-100 min-w-0">
            {/* title + category */}
            <div className="mb-4">
              <h3 className="text-xl font-black tracking-tighter text-zinc-900 group-hover:text-orange-600 transition-colors uppercase italic mb-0.5 truncate">
                {job.title}
              </h3>
              <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.25em]">
                {job.category}
              </p>
            </div>

            {/* info pills — lokasi, deadline, salary */}
            <div className="flex flex-wrap gap-2 mb-5">
              {/* Lokasi */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-xl">
                <MapPin size={11} className="text-orange-500 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wide text-zinc-600">
                  {job.city}
                </span>
              </div>

              {/* Deadline */}
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border",
                  isExpiringSoon
                    ? "bg-red-50 border-red-100"
                    : "bg-zinc-50 border-zinc-100",
                )}
              >
                <Calendar
                  size={11}
                  className={cn(
                    "shrink-0",
                    isExpiringSoon ? "text-red-500" : "text-orange-500",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-wide",
                    isExpiringSoon ? "text-red-600" : "text-zinc-600",
                  )}
                >
                  Deadline:{" "}
                  {new Date(job.deadline).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {isExpiringSoon && (
                  <span className="text-[8px] font-black uppercase text-red-400 ml-0.5">
                    · Segera!
                  </span>
                )}
              </div>

              {/* Salary — hanya tampil kalau ada */}
              {job.salary && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <span className="text-[10px] font-black text-emerald-700">
                    Rp {Number(job.salary).toLocaleString("id-ID")}
                  </span>
                  <span className="text-[9px] text-emerald-500 font-bold">
                    /bln
                  </span>
                </div>
              )}

              {/* Pre-test badge */}
              {job.preTest && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-xl">
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">
                    Pre-Test
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
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
                  "rounded-xl h-8 text-[10px] font-black uppercase tracking-widest transition-all",
                  job.status === "PUBLISHED"
                    ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    : "border-zinc-200 hover:bg-zinc-900 hover:text-white",
                )}
              >
                {job.status === "PUBLISHED" ? (
                  <>
                    <ToggleRight size={12} className="mr-1" /> Unpublish
                  </>
                ) : (
                  <>
                    <ToggleLeft size={12} className="mr-1" /> Publish
                  </>
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isDeleting}
                    className="rounded-xl h-8 text-[10px] font-black uppercase tracking-widest border-zinc-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={12} className="mr-1" /> Hapus
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-black uppercase italic">
                      Hapus Lowongan?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Lowongan <strong>{job.title}</strong> akan dihapus
                      permanen. Tindakan ini tidak bisa dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl font-black uppercase text-[10px]">
                      Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteJob(job.id)}
                      className="bg-red-500 hover:bg-red-600 rounded-xl font-black uppercase text-[10px]"
                    >
                      Ya, Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* ── Stats Panel ── */}
          <div className="md:w-44 bg-zinc-50/50 p-6 flex flex-col justify-center items-center gap-4 border-t md:border-t-0 md:border-l md:border-dashed border-zinc-200">
            <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-0.5">
                Total Pelamar
              </p>
              <div className="flex items-end justify-center gap-1">
                <p className="text-3xl font-black italic tracking-tighter text-zinc-900">
                  {job._count.applications}
                </p>
                <Users size={13} className="text-zinc-300 mb-1.5" />
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
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
      <div className="flex min-h-screen bg-zinc-50/50 w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-10">
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  Manajemen Lowongan
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">
                Job <span className="text-orange-500">Postings</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium mt-1">
                Kelola semua lowongan pekerjaan yang telah dibuat.
              </p>
            </div>
            <Button
              asChild
              className="bg-zinc-900 hover:bg-black text-white rounded-xl h-12 px-6 shadow-xl shadow-zinc-200 font-bold uppercase text-xs tracking-widest"
            >
              <Link to="/admin/jobs/create">
                <Plus className="mr-2 h-4 w-4 text-orange-400" /> Buat Lowongan
              </Link>
            </Button>
          </div>

          {/* SEARCH */}
          <div className="mb-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                className="pl-11 h-12 bg-white border-zinc-200 rounded-2xl shadow-sm focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-medium text-sm"
                type="text"
                placeholder="Cari judul lowongan..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
            {/* CATEGORY */}
            <div className="relative flex-1">
              <Input
                className="h-12 bg-white border-zinc-200 rounded-2xl shadow-sm focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-medium text-sm"
                type="text"
                placeholder="Filter kategori..."
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              />
            </div>
          </div>

          {/* List */}
          <div className="space-y-6">
            {isPending && (
              <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-4">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="font-black uppercase text-[10px] tracking-widest">
                  Memuat lowongan...
                </p>
              </div>
            )}

            {isError && (
              <div className="text-center py-20 bg-red-50 rounded-[2rem] border border-red-100">
                <p className="text-red-500 font-bold uppercase text-xs tracking-widest">
                  Gagal memuat data lowongan.
                </p>
              </div>
            )}

            {jobs?.data.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

            {!isPending && jobs?.data.length === 0 && (
              <Card className="border-2 border-dashed border-zinc-200 bg-white py-20 text-center rounded-[2rem]">
                <Briefcase className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">
                  Belum ada lowongan yang dibuat.
                </p>
              </Card>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-12">
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
