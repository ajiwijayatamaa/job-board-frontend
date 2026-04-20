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

  return (
    <Card
      onClick={() => navigate(`/admin/jobs/${job.id}`)}
      className="group overflow-hidden border-none shadow-sm hover:shadow-xl hover:shadow-zinc-200 transition-all duration-300 rounded-[2rem] bg-white cursor-pointer relative"
    >
      <div className="absolute top-1/2 -left-3 w-6 h-6 bg-zinc-50 rounded-full border border-zinc-100 -translate-y-1/2 hidden md:block" />
      <div className="absolute top-1/2 -right-3 w-6 h-6 bg-zinc-50 rounded-full border border-zinc-100 -translate-y-1/2 hidden md:block" />

      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Banner */}
          <div className="w-full md:w-56 h-40 md:h-auto shrink-0 relative overflow-hidden bg-zinc-100">
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
            <div
              className={cn(
                "absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                statusConfig[job.status].class,
              )}
            >
              {statusConfig[job.status].label}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between border-r border-dashed border-zinc-100">
            <div>
              <h3 className="text-xl font-black tracking-tighter text-zinc-900 group-hover:text-orange-600 transition-colors uppercase italic mb-1">
                {job.title}
              </h3>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-4">
                {job.category}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                <div className="flex items-center gap-2 text-zinc-500">
                  <MapPin size={13} className="text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-tight">
                    {job.city}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <Calendar size={13} className="text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-tight">
                    {new Date(job.deadline).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <Users size={13} className="text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-tight">
                    {job._count.applications} Pelamar
                  </span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2 text-zinc-900">
                    <span className="text-sm font-black italic">
                      Rp {Number(job.salary).toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex flex-wrap gap-2 mt-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={toggleStatus}
                disabled={isUpdating}
                className={cn(
                  "rounded-xl h-9 text-[10px] font-black uppercase tracking-widest transition-all",
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
                    className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest border-zinc-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
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

          {/* Stats */}
          <div className="md:w-48 bg-zinc-50/50 p-6 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l md:border-dashed border-zinc-200">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">
              Pelamar
            </p>
            <p className="text-3xl font-black italic tracking-tighter text-zinc-900">
              {job._count.applications}
            </p>
            {job.preTest && (
              <span className="mt-3 px-2 py-1 bg-orange-50 text-orange-500 text-[9px] font-black uppercase tracking-widest rounded-full">
                Ada Pre-Test
              </span>
            )}
            <ChevronRight className="mt-4 h-5 w-5 text-zinc-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AdminJobListPage() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedSearch] = useDebounceValue(search, 500);

  const {
    data: jobs,
    isPending,
    isError,
  } = useGetAdminJobs({
    page,
    take: 10,
    search: debouncedSearch,
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
              <Link to="/admin/jobs/new">
                <Plus className="mr-2 h-4 w-4 text-orange-400" /> Buat Lowongan
              </Link>
            </Button>
          </div>

          {/* Search */}
          <div className="mb-8 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              className="pl-11 h-12 bg-white border-zinc-200 rounded-2xl shadow-sm focus-visible:ring-orange-500/20 focus-visible:border-orange-500 font-medium text-sm"
              type="text"
              placeholder="Cari judul lowongan..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
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
