import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Calendar,
  ClipboardList,
  MapPin,
  Pencil,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { Link, redirect, useNavigate, useParams } from "react-router";
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
import { Badge } from "~/components/ui/badge";
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

const statusConfig = {
  PUBLISHED: { label: "Published", class: "bg-emerald-50 text-emerald-600" },
  DRAFT: { label: "Draft", class: "bg-zinc-100 text-zinc-500" },
  CLOSED: { label: "Closed", class: "bg-red-50 text-red-500" },
};

export default function AdminJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const navigate = useNavigate();

  const { data: job, isLoading } = useGetAdminJobById(numericId);
  const { data: existingTest } = useGetTestByJobId(numericId);
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateJobStatus(numericId);
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-zinc-50/50 w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto space-y-6"
          >
            <Button
              variant="ghost"
              asChild
              className="mb-2 -ml-2 text-zinc-500 hover:text-zinc-900 font-bold uppercase text-[10px] tracking-widest"
            >
              <Link to="/admin/jobs">
                <ArrowLeft className="mr-2 h-3 w-3" /> Kembali
              </Link>
            </Button>

            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                Detail Lowongan
              </span>
            </div>

            {/* Job Info Card */}
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Banner */}
                  <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden bg-zinc-100">
                    {job.banner ? (
                      <img
                        src={job.banner}
                        alt={job.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Briefcase className="w-12 h-12 text-zinc-300" />
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
                  <div className="p-8 flex-1 space-y-4">
                    <div>
                      <h1 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase italic">
                        {job.title}
                      </h1>
                      <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">
                        {job.category}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <MapPin size={13} className="text-orange-500" />
                        <span className="text-xs font-bold uppercase">
                          {job.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Calendar size={13} className="text-orange-500" />
                        <span className="text-xs font-bold uppercase">
                          {new Date(job.deadline).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      {job.salary && (
                        <span className="text-sm font-black italic text-zinc-900">
                          Rp {Number(job.salary).toLocaleString("id-ID")}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] font-bold"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Link to={`/admin/jobs/${id}/edit`}>
                          <Pencil size={12} className="mr-1" /> Edit
                        </Link>
                      </Button>

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
                          "rounded-xl h-9 text-[10px] font-black uppercase tracking-widest",
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

                      {/* Pre-Selection Test Buttons */}
                      {job.preTest ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest border-orange-200 text-orange-600 hover:bg-orange-50"
                          >
                            <Link
                              to={`/admin/jobs/${id}/pre-selection-test/edit`}
                            >
                              <ClipboardList size={12} className="mr-1" /> Edit
                              Test
                            </Link>
                          </Button>
                          {existingTest && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest border-zinc-200 hover:bg-zinc-50"
                            >
                              <Link
                                to={`/admin/pre-selection-tests/${existingTest.id}/results`}
                              >
                                <Award size={12} className="mr-1" /> Hasil Test
                              </Link>
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest border-zinc-200 hover:bg-zinc-900 hover:text-white"
                        >
                          <Link
                            to={`/admin/jobs/${id}/pre-selection-test/create`}
                          >
                            <ClipboardList size={12} className="mr-1" /> Buat
                            Test
                          </Link>
                        </Button>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isDeleting}
                            className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest border-zinc-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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
                              permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl font-black uppercase text-[10px]">
                              Batal
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteJob(numericId)}
                              className="bg-red-500 hover:bg-red-600 rounded-xl font-black uppercase text-[10px]"
                            >
                              Ya, Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applicant List */}
            <ApplicantList jobId={numericId} />
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
}
