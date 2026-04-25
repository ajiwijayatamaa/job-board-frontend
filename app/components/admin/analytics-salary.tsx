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

const salaryChartConfig = {
  avgSalary: { label: "Rata-rata Gaji", color: "#18181b" },
};

interface Props {
  data: AnalyticsSalaryTrends | undefined;
  isPending: boolean;
}

export default function AnalyticsSalary({ data, isPending }: Props) {
  const [salaryTab, setSalaryTab] = useState<"category" | "city">("category");

  const chartData =
    salaryTab === "category" ? (data?.byCategory ?? []) : (data?.byCity ?? []);

  const xKey = salaryTab === "category" ? "category" : "city";

  return (
    <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
      <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Tren Gaji
          </CardTitle>
          <Tabs
            value={salaryTab}
            onValueChange={(v) => setSalaryTab(v as "category" | "city")}
            className="bg-zinc-100 p-1 rounded-xl"
          >
            <TabsList className="bg-transparent h-8 gap-1">
              {[
                { value: "category", label: "Kategori" },
                { value: "city", label: "Kota" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isPending ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !chartData.length ? (
          <div className="h-64 flex items-center justify-center text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
            Belum ada data
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
                stroke="#f4f4f5"
              />
              <XAxis
                dataKey={xKey}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fontWeight: 700, fill: "#a1a1aa" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fontWeight: 700, fill: "#a1a1aa" }}
                tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`}
              />
              <ChartTooltip
                cursor={{ fill: "#fafafa" }}
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <span className="font-black text-orange-400">
                        Rp {Number(value).toLocaleString("id-ID")}
                      </span>
                    )}
                  />
                }
              />
              <Bar
                dataKey="avgSalary"
                fill="#18181b"
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
