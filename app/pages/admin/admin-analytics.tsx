import { motion } from "framer-motion";
import { Calendar, Sparkles } from "lucide-react";
import { useState } from "react";
import { redirect } from "react-router";
import AdminSidebar from "~/components/admin/admin-sidebar";
import AnalyticsDemographics from "~/components/admin/analytics-demographics";
import AnalyticsInterests from "~/components/admin/analytics-interests";
import AnalyticsOverviewCards from "~/components/admin/analytics-overview-cards";
import AnalyticsSalary from "~/components/admin/analytics-salary";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { SidebarProvider } from "~/components/ui/sidebar";
import useGetAnalyticsOverview from "~/hooks/api/useGetAnalyticsOverview";
import useGetApplicantInterests from "~/hooks/api/useGetApplicantInterests";
import useGetDemographics from "~/hooks/api/useGetDemographics";
import useGetSalaryTrends from "~/hooks/api/useGetSalaryTrends";
import { useAuth } from "~/stores/useAuth";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ADMIN") return redirect("/");
};

export default function AdminAnalyticsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedFilter, setAppliedFilter] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const { data: overview, isPending: isOverviewPending } =
    useGetAnalyticsOverview();
  const { data: demographics, isPending: isDemoPending } =
    useGetDemographics(appliedFilter);
  const { data: salaryTrends, isPending: isSalaryPending } =
    useGetSalaryTrends(appliedFilter);
  const { data: interests, isPending: isInterestsPending } =
    useGetApplicantInterests(appliedFilter);

  const applyFilter = () => {
    setAppliedFilter({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const resetFilter = () => {
    setStartDate("");
    setEndDate("");
    setAppliedFilter({});
  };

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
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  Website Analytics
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">
                Dashboard <span className="text-orange-500">Analitik</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium mt-1">
                Pantau performa lowongan dan tren pelamar perusahaan Anda.
              </p>
            </div>

            {/* Date Range Filter */}
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                      Dari Tanggal
                    </p>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-11 rounded-xl border-zinc-200 font-bold text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                      Sampai Tanggal
                    </p>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-11 rounded-xl border-zinc-200 font-bold text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={applyFilter}
                      className="h-11 px-6 rounded-xl bg-zinc-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest"
                    >
                      <Calendar className="w-3 h-3 mr-1" /> Terapkan
                    </Button>
                    {(appliedFilter.startDate || appliedFilter.endDate) && (
                      <Button
                        onClick={resetFilter}
                        variant="outline"
                        className="h-11 px-4 rounded-xl border-zinc-200 font-black uppercase text-[10px] tracking-widest hover:border-red-200 hover:text-red-500"
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <AnalyticsOverviewCards
              data={overview}
              isPending={isOverviewPending}
            />
            <AnalyticsDemographics
              data={demographics}
              isPending={isDemoPending}
            />
            <AnalyticsSalary data={salaryTrends} isPending={isSalaryPending} />
            <AnalyticsInterests
              data={interests}
              isPending={isInterestsPending}
            />
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
}
