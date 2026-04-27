import { BarChart3, Briefcase, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { AnalyticsOverview } from "~/types/analytics";

// ── status config — data identik, hanya styling beda ──
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

interface Props {
  data: AnalyticsOverview | undefined;
  isPending: boolean;
}

export default function AnalyticsOverviewCards({ data, isPending }: Props) {
  // ── stat cards — data binding identik ──
  const statCards = [
    { label: "Total Lowongan", value: data?.totalJobs ?? 0, icon: Briefcase },
    {
      label: "Published",
      value: data?.totalPublishedJobs ?? 0,
      icon: BarChart3,
    },
    {
      label: "Total Pelamar",
      value: data?.totalApplications ?? 0,
      icon: Users,
    },
    {
      label: "Diterima",
      value:
        data?.applicationsByStatus.find((s) => s.status === "ACCEPTED")
          ?.count ?? 0,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <Card
            key={label}
            className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden relative group hover:border-[#A5C0E4] hover:shadow-md hover:shadow-slate-100 transition-all duration-200"
          >
            {/* Left accent bar on hover — identik dengan admin-overview */}
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
                {isPending ? "..." : value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Status Breakdown ── */}
      <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
        <CardHeader className="border-b border-[#E2EAF4] bg-[#F4F8FF]">
          <CardTitle className="flex items-center gap-3 text-[#0F2342] font-bold text-base">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-[#1D5FAD]" />
            </div>
            Status Lamaran
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          {isPending ? (
            <div className="h-12 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#1D5FAD] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {data?.applicationsByStatus.map(({ status, count }) => (
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
                    <p className="text-xl font-bold text-[#0F2342]">{count}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
