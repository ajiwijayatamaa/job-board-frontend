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

const genderChartConfig = {
  MALE: { label: "Laki-laki", color: "#18181b" },
  FEMALE: { label: "Perempuan", color: "#f97316" },
  unknown: { label: "Tidak Diketahui", color: "#d4d4d8" },
};

const ageChartConfig = {
  count: { label: "Pelamar", color: "#f97316" },
};

const GENDER_COLORS = ["#18181b", "#f97316", "#d4d4d8"];

interface Props {
  data: AnalyticsDemographics | undefined;
  isPending: boolean;
}

export default function AnalyticsDemographics({ data, isPending }: Props) {
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
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gender */}
        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
            <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
              <Users className="h-5 w-5 text-orange-500" />
              Gender Pelamar
            </CardTitle>
          </CardHeader>
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
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            GENDER_COLORS[i % GENDER_COLORS.length],
                        }}
                      />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          {item.label}
                        </p>
                        <p className="text-lg font-black italic text-zinc-900">
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

        {/* Age Groups */}
        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
            <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
              <Users className="h-5 w-5 text-orange-500" />
              Kelompok Usia
            </CardTitle>
          </CardHeader>
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
                    stroke="#f4f4f5"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fontWeight: 700, fill: "#a1a1aa" }}
                  />
                  <YAxis
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
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Locations */}
      <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
          <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
            <MapPin className="h-5 w-5 text-orange-500" />
            Lokasi Pelamar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isPending ? (
            <div className="h-12 flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !data?.locations.length ? (
            <div className="py-8 text-center text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
              Belum ada data
            </div>
          ) : (
            <div className="space-y-3">
              {data.locations.slice(0, 8).map((loc, i) => (
                <div key={loc.city} className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-zinc-400 w-4">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-black text-zinc-900 capitalize">
                        {loc.city}
                      </p>
                      <p className="text-xs font-black text-orange-600">
                        {loc.count}
                      </p>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
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
