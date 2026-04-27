import { motion } from "framer-motion";
import {
  Briefcase,
  ChevronRight,
  MapPin,
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
import useGetAnalyticsOverview from "~/hooks/api/useGetAnalyticsOverview";
import useGetAdminJobs from "~/hooks/api/useGetAdminJobs";
import { useAuth } from "~/stores/useAuth";
import { cn } from "~/lib/utils";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ADMIN") return redirect("/");
};

// ── identik dengan original ──
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
  // ── hooks identik ──
  const { data: overview, isPending: isOverviewPending } =
    useGetAnalyticsOverview();

  const { data: recentJobs, isPending: isJobsPending } = useGetAdminJobs({
    page: 1,
    take: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // ── statCards identik ──
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
      <div className="flex min-h-screen bg-[#F0F5FB] w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
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
                    Admin Dashboard
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-[#0F2342]">
                  Company Overview
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Ringkasan performa perusahaan kamu hari ini.
                </p>
              </div>
              <Button
                asChild
                className="bg-[#1D5FAD] hover:bg-[#174E8F] text-white rounded-xl h-11 px-5 font-semibold text-sm"
              >
                <Link to="/admin/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Lihat Analytics
                </Link>
              </Button>
            </div>

            {/* ── Stat Cards — data binding identik ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map(({ label, value, icon: Icon }) => (
                <Card
                  key={label}
                  className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden relative group hover:border-[#A5C0E4] hover:shadow-md hover:shadow-slate-100 transition-all duration-200"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#1D5FAD] opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl" />
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                        {label}
                      </p>
                      <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center group-hover:bg-[#1D5FAD] transition-colors">
                        <Icon className="w-4 h-4 text-[#1D5FAD] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-[#0F2342]">
                      {isOverviewPending ? "..." : value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ── Status Breakdown — data binding identik ── */}
            <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
              <CardHeader className="border-b border-[#E2EAF4] bg-[#F4F8FF]">
                <CardTitle className="flex items-center gap-3 text-[#0F2342] font-bold text-base">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                    <Users className="h-4 w-4 text-[#1D5FAD]" />
                  </div>
                  Status Lamaran
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {isOverviewPending ? (
                  <div className="h-12 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#1D5FAD] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {overview?.applicationsByStatus.map(({ status, count }) => (
                      <div
                        key={status}
                        className="flex items-center gap-3 px-4 py-3 bg-[#F4F8FF] border border-[#E2EAF4] rounded-xl"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: statusColors[status] ?? "#d4d4d8",
                          }}
                        />
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            {statusLabels[status] ?? status}
                          </p>
                          <p className="text-xl font-bold text-[#0F2342]">
                            {count}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ── Recent Job Postings — data binding identik ── */}
            <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
              <CardHeader className="border-b border-[#E2EAF4] bg-[#F4F8FF] flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-[#0F2342] font-bold text-base">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-[#1D5FAD]" />
                  </div>
                  Lowongan Terbaru
                </CardTitle>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs font-semibold text-slate-400 hover:text-[#1D5FAD]"
                >
                  <Link to="/admin/jobs">
                    Lihat Semua <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-5">
                {isJobsPending ? (
                  <div className="h-24 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#1D5FAD] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : !recentJobs?.data.length ? (
                  <div className="py-8 text-center text-slate-400 text-sm font-medium">
                    Belum ada lowongan
                  </div>
                ) : (
                  <div className="space-y-1">
                    {recentJobs.data.map((job) => (
                      <Link
                        key={job.id}
                        to={`/admin/jobs/${job.id}`}
                        className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[#F0F5FB] transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0F2342] truncate group-hover:text-[#1D5FAD] transition-colors">
                            {job.title}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1 text-[11px] text-slate-400">
                              <MapPin size={10} className="text-[#1D5FAD]" />
                              {job.city}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-slate-400">
                              <Calendar size={10} className="text-[#1D5FAD]" />
                              {new Date(job.deadline).toLocaleDateString(
                                "id-ID",
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          <span className="text-xs text-slate-400 font-medium">
                            {job._count.applications} pelamar
                          </span>
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-semibold",
                              statusConfig[job.status].class,
                            )}
                          >
                            {statusConfig[job.status].label}
                          </span>
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#1D5FAD] transition-colors" />
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
