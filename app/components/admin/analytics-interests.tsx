import { BarChart3, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import type { AnalyticsApplicantInterests } from "~/types/analytics";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const categoryChartConfig = {
  count: { label: "Pelamar", color: "#f97316" },
};

interface Props {
  data: AnalyticsApplicantInterests | undefined;
  isPending: boolean;
}

export default function AnalyticsInterests({ data, isPending }: Props) {
  const spinner = (
    <div className="h-48 flex items-center justify-center">
      <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const empty = (
    <div className="h-48 flex items-center justify-center text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
      Belum ada data
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* By Category */}
      <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
          <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            Minat per Kategori
          </CardTitle>
        </CardHeader>
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
                  stroke="#f4f4f5"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 700, fill: "#a1a1aa" }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 700, fill: "#a1a1aa" }}
                />
                <ChartTooltip
                  cursor={{ fill: "#fafafa" }}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="count"
                  fill="#f97316"
                  radius={[0, 6, 6, 0]}
                  barSize={20}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Top Jobs */}
      <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
          <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
            <Briefcase className="h-5 w-5 text-orange-500" />
            Top 10 Lowongan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isPending ? (
            spinner
          ) : !data?.topJobs.length ? (
            empty
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-48">
              {data.topJobs.map((job, i) => (
                <div key={job.jobId} className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-zinc-400 w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-zinc-900 truncate">
                      {job.title}
                    </p>
                  </div>
                  <span className="text-xs font-black text-orange-600 shrink-0">
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
