import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  CheckCircle,
  TrendingUp,
  Users,
  XCircle,
  Search,
} from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Link, redirect, useParams } from "react-router";
import PaginationSection from "~/components/pagination-section";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import useGetTestResults from "~/hooks/api/useGetTestResults";
import { cn } from "~/lib/utils";
import { useAuth } from "~/stores/useAuth";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ADMIN") return redirect("/");
};

const PASS_SCORE = 75;

export default function TestResultsPage() {
  const { testId } = useParams<{ testId: string }>();
  const numericTestId = Number(testId);

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const { data, isLoading } = useGetTestResults(numericTestId, {
    page,
    take: 10,
  });

  const results = data?.data;

  const passedCount = data?.meta.total
    ? results?.filter((r) => Number(r.score) >= PASS_SCORE).length
    : 0;

  const avgScore = results?.length
    ? (
        results.reduce((acc, r) => acc + Number(r.score), 0) / results.length
      ).toFixed(1)
    : "—";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-[#1D5FAD]/10 border-t-[#1D5FAD] rounded-full animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Menganalisis Hasil...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto"
      >
        {/* Tombol Kembali */}
        <Button
          variant="ghost"
          asChild
          className="mb-8 -ml-2 text-slate-400 hover:text-[#0F2342] hover:bg-slate-200/50 font-bold uppercase text-[10px] tracking-widest transition-all"
        >
          <Link to="/admin/jobs">
            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Kembali ke Lowongan
          </Link>
        </Button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-[#1D5FAD]/10 rounded-lg">
                <Award className="w-4 h-4 text-[#1D5FAD]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Analitik Performa
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-[#0F2342] uppercase italic leading-none">
              Hasil <span className="text-[#1D5FAD]">Pre-Seleksi</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="px-4 py-2 bg-[#F4F8FF] rounded-xl border border-[#1D5FAD]/10">
              <p className="text-[9px] font-black uppercase text-[#1D5FAD] tracking-widest">
                Standar Kelulusan
              </p>
              <p className="text-lg font-black text-[#0F2342]">{PASS_SCORE}+</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              label: "Total Kandidat",
              value: data?.meta.total ?? 0,
              icon: Users,
              color: "text-[#1D5FAD]",
              bg: "bg-blue-50",
            },
            {
              label: "Lulus Kualifikasi",
              value: passedCount,
              icon: CheckCircle,
              color: "text-teal-600",
              bg: "bg-teal-50",
            },
            {
              label: "Rata-rata Skor",
              value: avgScore,
              icon: TrendingUp,
              color: "text-[#0F2342]",
              bg: "bg-slate-100",
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card
              key={label}
              className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden group"
            >
              <CardContent className="p-7 flex items-center gap-5">
                <div
                  className={cn(
                    "p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300",
                    bg,
                  )}
                >
                  <Icon className={cn("w-6 h-6", color)} />
                </div>
                <div>
                  <p className="text-3xl font-black text-[#0F2342] tracking-tighter">
                    {value}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Table Content */}
        <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between bg-white">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-[#0F2342] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1D5FAD]" />
              Peringkat Kandidat
            </CardTitle>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total {data?.meta.total} Peserta
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {!results?.length ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-slate-200" />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Tidak ada data partisipasi ditemukan
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {results.map((result, i) => {
                  const score = Number(result.score);
                  const isPassed = score >= PASS_SCORE;
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="group flex items-center gap-5 px-8 py-5 hover:bg-[#F4F8FF]/50 transition-all"
                    >
                      {/* Nomor Urut */}
                      <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-white flex items-center justify-center text-[11px] font-black text-slate-400 transition-colors border border-transparent group-hover:border-slate-100">
                        {String((page - 1) * 10 + i + 1).padStart(2, "0")}
                      </div>

                      {/* Foto Profil */}
                      <div className="w-11 h-11 rounded-2xl bg-[#1D5FAD]/10 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {result.user.profilePhoto ? (
                          <img
                            src={result.user.profilePhoto}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-black text-[#1D5FAD]">
                            {result.user.fullName?.[0] ??
                              result.user.email[0].toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Identitas */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-[#0F2342] truncate uppercase tracking-tight group-hover:text-[#1D5FAD] transition-colors">
                          {result.user.fullName ?? "Kandidat Anonim"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold truncate mt-0.5">
                          {result.user.email}
                        </p>
                      </div>

                      {/* Display Skor */}
                      <div className="text-right px-4">
                        <p
                          className={cn(
                            "text-2xl font-black italic tracking-tighter leading-none",
                            isPassed ? "text-teal-600" : "text-rose-500",
                          )}
                        >
                          {score.toFixed(0)}
                        </p>
                        <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest mt-1">
                          Poin
                        </p>
                      </div>

                      {/* Badge Status */}
                      <div
                        className={cn(
                          "hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border transition-all",
                          isPassed
                            ? "bg-teal-50 text-teal-600 border-teal-100"
                            : "bg-rose-50 text-rose-500 border-rose-100",
                        )}
                      >
                        {isPassed ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {isPassed ? "Lulus" : "Gagal"}
                      </div>

                      {/* Tombol Detail */}
                      <Link
                        to={`/admin/pre-selection-tests/${result.id}/answers`}
                        className="ml-2"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#1D5FAD] hover:bg-[#1D5FAD]/5 border border-transparent hover:border-[#1D5FAD]/10 transition-all"
                        >
                          Detail
                        </Button>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigasi Halaman */}
        <div className="mt-12 flex justify-center">
          {!!data?.meta && (
            <div className="bg-white px-6 py-3 rounded-[2rem] shadow-sm border border-slate-100">
              <PaginationSection
                meta={data.meta}
                onChangePage={(page) => setPage(page)}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
