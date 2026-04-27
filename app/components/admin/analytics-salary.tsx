import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { AnalyticsSalaryTrends } from "~/types/analytics";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// ── chart config — warna disesuaikan ──
const salaryChartConfig = {
  avgSalary: { label: "Rata-rata Gaji", color: "#1D5FAD" },
};

interface Props {
  data: AnalyticsSalaryTrends | undefined;
  isPending: boolean;
}

export default function AnalyticsSalary({ data, isPending }: Props) {
  // ── state & logic — identik ──
  const [salaryTab, setSalaryTab] = useState<"category" | "city">("category");

  const chartData =
    salaryTab === "category" ? (data?.byCategory ?? []) : (data?.byCity ?? []);

  const xKey = salaryTab === "category" ? "category" : "city";

  return (
    <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
      {/* ── Header ── */}
      <CardHeader className="border-b border-[#E2EAF4] bg-[#F4F8FF]">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-3 text-[#0F2342] font-bold text-base">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-[#1D5FAD]" />
            </div>
            Tren Gaji
          </CardTitle>

          {/* ── Tabs — logic identik, styling disesuaikan ── */}
          <Tabs
            value={salaryTab}
            onValueChange={(v) => setSalaryTab(v as "category" | "city")}
          >
            <TabsList className="bg-[#E2EAF4] h-8 p-1 rounded-lg gap-0.5">
              {[
                { value: "category", label: "Kategori" },
                { value: "city", label: "Kota" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-md text-[10px] font-semibold uppercase tracking-widest px-3 data-[state=active]:bg-white data-[state=active]:text-[#1D5FAD] data-[state=active]:shadow-sm text-slate-400"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      {/* ── Content ── */}
      <CardContent className="p-6">
        {isPending ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#1D5FAD] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !chartData.length ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-300">
              Belum ada data
            </p>
          </div>
        ) : (
          <ChartContainer config={salaryChartConfig} className="h-64 w-full">
            <BarChart
              data={chartData as any[]}
              margin={{ top: 0, right: 0, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2EAF4"
              />
              <XAxis
                dataKey={xKey}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 600, fill: "#94A3B8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 600, fill: "#94A3B8" }}
                tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`}
              />
              <ChartTooltip
                cursor={{ fill: "#F4F8FF" }}
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <span className="font-semibold text-[#1D5FAD]">
                        Rp {Number(value).toLocaleString("id-ID")}
                      </span>
                    )}
                  />
                }
              />
              <Bar
                dataKey="avgSalary"
                fill="#1D5FAD"
                radius={[6, 6, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
