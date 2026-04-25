import { BarChart3, Briefcase, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { AnalyticsOverview } from "~/types/analytics";

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
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Lowongan",
            value: data?.totalJobs ?? 0,
            icon: Briefcase,
          },
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
        ].map(({ label, value, icon: Icon }) => (
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
                {isPending ? "..." : value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Breakdown */}
      <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
          <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            Status Lamaran
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isPending ? (
            <div className="h-12 flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {data?.applicationsByStatus.map(({ status, count }) => (
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
    </div>
  );
}
