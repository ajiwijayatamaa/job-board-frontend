import { BarChart3, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import type { AnalyticsApplicantInterests } from "~/types/analytics";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// ── chart config — warna disesuaikan ──
const categoryChartConfig = {
  count: { label: "Pelamar", color: "#1D5FAD" },
};

interface Props {
  data: AnalyticsApplicantInterests | undefined;
  isPending: boolean;
}

export default function AnalyticsInterests({ data, isPending }: Props) {
  // ── shared states ──
  const spinner = (
    <div className="h-48 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#1D5FAD] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const empty = (
    <div className="h-48 flex items-center justify-center">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-300">
        Belum ada data
      </p>
    </div>
  );

  // ── shared card head ──
  const CardHead = ({
    icon: Icon,
    title,
  }: {
    icon: React.ElementType;
    title: string;
  }) => (
    <CardHeader className="border-b border-[#E2EAF4] bg-[#F4F8FF]">
      <CardTitle className="flex items-center gap-3 text-[#0F2342] font-bold text-base">
        <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
          <Icon className="h-4 w-4 text-[#1D5FAD]" />
        </div>
        {title}
      </CardTitle>
    </CardHeader>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── By Category ── */}
      <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
        <CardHead icon={BarChart3} title="Minat per Kategori" />
        <CardContent className="p-6">
          {isPending ? (
            spinner
          ) : !data?.byCategory.length ? (
            empty
          ) : (
            <ChartContainer
              config={categoryChartConfig}
              className="h-48 w-full"
            >
              <BarChart
                data={data.byCategory}
                layout="vertical"
                margin={{ top: 0, right: 0, left: 60, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#E2EAF4"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 600, fill: "#94A3B8" }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 600, fill: "#94A3B8" }}
                />
                <ChartTooltip
                  cursor={{ fill: "#F4F8FF" }}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="count"
                  fill="#1D5FAD"
                  radius={[0, 6, 6, 0]}
                  barSize={20}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* ── Top Jobs ── */}
      <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
        <CardHead icon={Briefcase} title="Top 10 Lowongan" />
        <CardContent className="p-6">
          {isPending ? (
            spinner
          ) : !data?.topJobs.length ? (
            empty
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-48">
              {data.topJobs.map((job, i) => (
                <div
                  key={job.jobId}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#F4F8FF] transition-colors group"
                >
                  {/* Rank badge */}
                  <span
                    className={[
                      "text-[10px] font-bold w-5 h-5 rounded-md flex items-center justify-center shrink-0",
                      i === 0
                        ? "bg-[#1D5FAD] text-white"
                        : i === 1
                          ? "bg-[#A5C0E4] text-white"
                          : i === 2
                            ? "bg-[#D1DFF0] text-[#1D5FAD]"
                            : "text-slate-300 bg-transparent",
                    ].join(" ")}
                  >
                    {i + 1}
                  </span>

                  {/* Title */}
                  <p className="flex-1 min-w-0 text-sm font-semibold text-[#0F2342] truncate group-hover:text-[#1D5FAD] transition-colors">
                    {job.title}
                  </p>

                  {/* Count */}
                  <span className="text-xs font-bold text-[#1D5FAD] shrink-0">
                    {job.count} pelamar
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
