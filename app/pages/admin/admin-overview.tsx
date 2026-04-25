import { motion } from "framer-motion";
import {
  Briefcase,
  ChevronRight,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Link, redirect } from "react-router";
import AdminSidebar from "~/components/admin/admin-sidebar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SidebarProvider } from "~/components/ui/sidebar";
import { Badge } from "~/components/ui/badge";
import useGetAnalyticsOverview from "~/hooks/api/useGetAnalyticsOverview";
import useGetAdminJobs from "~/hooks/api/useGetAdminJobs";
import { useAuth } from "~/stores/useAuth";
import { cn } from "~/lib/utils";

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

const statusColors: Record<string, string> = {
  PENDING: "#d4d4d8",
  PROCESSED: "#60a5fa",
  INTERVIEW: "#f97316",
  ACCEPTED: "#34d399",
  REJECTED: "#f87171",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  PROCESSED: "Diproses",
  INTERVIEW: "Interview",
  ACCEPTED: "Diterima",
  REJECTED: "Ditolak",
};

export default function AdminOverviewPage() {
  const { data: overview, isPending: isOverviewPending } =
    useGetAnalyticsOverview();

  const { data: recentJobs, isPending: isJobsPending } = useGetAdminJobs({
    page: 1,
    take: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const statCards = [
    {
      label: "Total Lowongan",
      value: overview?.totalJobs ?? 0,
      icon: Briefcase,
    },
    {
      label: "Published",
      value: overview?.totalPublishedJobs ?? 0,
      icon: BarChart3,
    },
    {
      label: "Total Pelamar",
      value: overview?.totalApplications ?? 0,
      icon: Users,
    },
    {
      label: "Diterima",
      value:
        overview?.applicationsByStatus.find((s) => s.status === "ACCEPTED")
          ?.count ?? 0,
      icon: TrendingUp,
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-zinc-50/50 w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                    Admin Dashboard
                  </span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">
                  Company <span className="text-orange-500">Overview</span>
                </h1>
                <p className="text-zinc-500 text-sm font-medium mt-1">
                  Ringkasan performa perusahaan kamu hari ini.
                </p>
              </div>
              <Button
                asChild
                className="bg-zinc-900 hover:bg-black text-white rounded-xl h-12 px-6 font-bold uppercase text-xs tracking-widest"
              >
                <Link to="/admin/analytics">
                  <BarChart3 className="mr-2 h-4 w-4 text-orange-400" />
                  Lihat Analytics
                </Link>
              </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map(({ label, value, icon: Icon }) => (
                <Card
                  key={label}
                  className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden relative group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                        {label}
                      </p>
                      <Icon className="w-4 h-4 text-zinc-300 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <p className="text-3xl font-black italic tracking-tighter text-zinc-900">
                      {isOverviewPending ? "..." : value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Status Breakdown */}
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
                <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
                  <Users className="h-5 w-5 text-orange-500" />
                  Status Lamaran
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isOverviewPending ? (
                  <div className="h-12 flex items-center justify-center">
                    <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {overview?.applicationsByStatus.map(({ status, count }) => (
                      <div
                        key={status}
                        className="flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-2xl"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: statusColors[status] ?? "#d4d4d8",
                          }}
                        />
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                            {statusLabels[status] ?? status}
                          </p>
                          <p className="text-xl font-black italic tracking-tighter text-zinc-900">
                            {count}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Job Postings */}
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="border-b border-zinc-50 bg-zinc-50/30 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
                  <Briefcase className="h-5 w-5 text-orange-500" />
                  Lowongan Terbaru
                </CardTitle>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-orange-500"
                >
                  <Link to="/admin/jobs">
                    Lihat Semua <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {isJobsPending ? (
                  <div className="h-24 flex items-center justify-center">
                    <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : !recentJobs?.data.length ? (
                  <div className="py-8 text-center text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                    Belum ada lowongan
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentJobs.data.map((job) => (
                      <Link
                        key={job.id}
                        to={`/admin/jobs/${job.id}`}
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-zinc-900 uppercase italic truncate group-hover:text-orange-500 transition-colors">
                            {job.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase">
                              <MapPin size={10} className="text-orange-500" />
                              {job.city}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase">
                              <Calendar size={10} className="text-orange-500" />
                              {new Date(job.deadline).toLocaleDateString(
                                "id-ID",
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          <span className="text-[10px] font-black text-zinc-400">
                            {job._count.applications} pelamar
                          </span>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                              statusConfig[job.status].class,
                            )}
                          >
                            {statusConfig[job.status].label}
                          </span>
                          <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-orange-500 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
}
