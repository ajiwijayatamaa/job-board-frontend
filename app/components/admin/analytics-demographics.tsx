import { MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import type { AnalyticsDemographics } from "~/types/analytics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

// ── chart config — warna disesuaikan ke blue corporate ──
const genderChartConfig = {
  MALE: { label: "Laki-laki", color: "#1D5FAD" },
  FEMALE: { label: "Perempuan", color: "#7DD3FC" },
  unknown: { label: "Tidak Diketahui", color: "#CBD5E1" },
};

const ageChartConfig = {
  count: { label: "Pelamar", color: "#1D5FAD" },
};

const GENDER_COLORS = ["#1D5FAD", "#7DD3FC", "#CBD5E1"];

interface Props {
  data: AnalyticsDemographics | undefined;
  isPending: boolean;
}

export default function AnalyticsDemographics({ data, isPending }: Props) {
  // ── data transform — identik ──
  const genderData = data
    ? Object.entries(data.gender).map(([key, value]) => ({
        name: key,
        value,
        label:
          key === "MALE"
            ? "Laki-laki"
            : key === "FEMALE"
              ? "Perempuan"
              : "Tidak Diketahui",
      }))
    : [];

  const ageData = data
    ? Object.entries(data.ageGroups).map(([key, value]) => ({
        label: key,
        count: value,
      }))
    : [];

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

  // ── shared card header renderer ──
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
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Gender ── */}
        <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
          <CardHead icon={Users} title="Gender Pelamar" />
          <CardContent className="p-6">
            {isPending ? (
              spinner
            ) : genderData.length === 0 ? (
              empty
            ) : (
              <div className="flex items-center gap-6">
                <ChartContainer
                  config={genderChartConfig}
                  className="h-48 w-48 shrink-0"
                >
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                    >
                      {genderData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={GENDER_COLORS[i % GENDER_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>

                <div className="space-y-3">
                  {genderData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            GENDER_COLORS[i % GENDER_COLORS.length],
                        }}
                      />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                          {item.label}
                        </p>
                        <p className="text-xl font-bold text-[#0F2342]">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Age Groups ── */}
        <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
          <CardHead icon={Users} title="Kelompok Usia" />
          <CardContent className="p-6">
            {isPending ? (
              spinner
            ) : ageData.length === 0 ? (
              empty
            ) : (
              <ChartContainer config={ageChartConfig} className="h-48 w-full">
                <BarChart
                  data={ageData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2EAF4"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 600, fill: "#94A3B8" }}
                  />
                  <YAxis
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
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Locations ── */}
      <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
        <CardHead icon={MapPin} title="Lokasi Pelamar" />
        <CardContent className="p-6">
          {isPending ? (
            <div className="h-12 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#1D5FAD] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !data?.locations.length ? (
            <div className="py-8 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-300">
                Belum ada data
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.locations.slice(0, 8).map((loc, i) => (
                <div key={loc.city} className="flex items-center gap-4">
                  {/* Rank */}
                  <span className="text-[10px] font-bold text-slate-300 w-4 text-right shrink-0">
                    {i + 1}
                  </span>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-semibold text-[#0F2342] capitalize">
                        {loc.city}
                      </p>
                      <p className="text-xs font-bold text-[#1D5FAD]">
                        {loc.count}
                      </p>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-[#E2EAF4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1D5FAD] rounded-full transition-all duration-500"
                        style={{
                          width: `${(loc.count / (data.locations[0]?.count ?? 1)) * 100}%`,
                        }}
                      />
                    </div>
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
