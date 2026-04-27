import { motion } from "framer-motion";
import { BarChart3, Calendar, X } from "lucide-react";
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
  // ── state & logic — identik ──
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

  const isFilterActive = !!(appliedFilter.startDate || appliedFilter.endDate);

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
            {/* ── Header — konsisten dengan admin-overview & admin-job-list ── */}
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
                    Website Analytics
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-[#0F2342]">
                  Dashboard Analitik
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Pantau performa lowongan dan tren pelamar perusahaan Anda.
                </p>
              </div>

              {/* Active filter indicator */}
              {isFilterActive && (
                <div className="flex items-center gap-2 px-3 py-2 bg-[#EFF6FF] border border-[#A5C0E4] rounded-xl text-xs font-semibold text-[#1D5FAD]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {appliedFilter.startDate ?? "—"} →{" "}
                    {appliedFilter.endDate ?? "—"}
                  </span>
                </div>
              )}
            </div>

            {/* ── Date Range Filter Card ── */}
            <Card className="border border-[#E2EAF4] shadow-none rounded-2xl bg-white overflow-hidden">
              {/* Card header strip */}
              <div className="px-6 py-4 border-b border-[#E2EAF4] bg-[#F4F8FF] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#1D5FAD]" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Filter Rentang Waktu
                  </p>
                  <p className="text-sm font-semibold text-[#0F2342]">
                    Saring data berdasarkan periode tertentu
                  </p>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-end gap-4">
                  {/* Start date */}
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                      Dari Tanggal
                    </p>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-10 rounded-xl border-[#D1DFF0] text-sm bg-[#F4F8FF] text-[#0F2342] font-medium focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD]"
                    />
                  </div>

                  {/* End date */}
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                      Sampai Tanggal
                    </p>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-10 rounded-xl border-[#D1DFF0] text-sm bg-[#F4F8FF] text-[#0F2342] font-medium focus-visible:ring-[#1D5FAD]/20 focus-visible:border-[#1D5FAD]"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={applyFilter}
                      className="h-10 px-5 rounded-xl bg-[#1D5FAD] hover:bg-[#174E8F] text-white font-semibold text-xs"
                    >
                      <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                      Terapkan
                    </Button>
                    {isFilterActive && (
                      <Button
                        onClick={resetFilter}
                        variant="outline"
                        className="h-10 px-4 rounded-xl border-[#D1DFF0] text-slate-500 font-semibold text-xs hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── Analytics Sub-components — props identik ── */}
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
