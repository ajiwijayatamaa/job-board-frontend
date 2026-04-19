import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  CheckCircle,
  TrendingUp,
  Users,
  XCircle,
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

  const passed = results?.filter((r) => Number(r.score) >= PASS_SCORE) ?? [];
  const avgScore = results?.length
    ? (
        results.reduce((acc, r) => acc + Number(r.score), 0) / results.length
      ).toFixed(1)
    : "—";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto"
      >
        <Button
          variant="ghost"
          asChild
          className="mb-6 -ml-2 text-zinc-500 hover:text-zinc-900 font-bold uppercase text-[10px] tracking-widest"
        >
          <Link to="/admin/jobs">
            <ArrowLeft className="mr-2 h-3 w-3" /> Kembali
          </Link>
        </Button>

        <div className="flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Hasil Test
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic mb-8">
          Hasil <span className="text-orange-500">Pre-Selection</span>
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Peserta",
              value: data?.meta.total ?? 0, // ✅ pakai meta.total bukan results.length
              icon: Users,
              color: "text-zinc-900",
            },
            {
              label: "Lulus (≥75)",
              value: passed.length,
              icon: CheckCircle,
              color: "text-emerald-600",
            },
            {
              label: "Rata-rata Skor",
              value: avgScore,
              icon: TrendingUp,
              color: "text-orange-500",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card
              key={label}
              className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden"
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-zinc-50 rounded-2xl">
                  <Icon className={cn("w-5 h-5", color)} />
                </div>
                <div>
                  <p className="text-2xl font-black text-zinc-900">{value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    {label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
            <CardTitle className="text-sm font-black uppercase italic tracking-tight text-zinc-900">
              Daftar Hasil Peserta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!results?.length ? (
              <div className="p-12 text-center text-zinc-400">
                <Award className="w-10 h-10 mx-auto mb-3 text-zinc-200" />
                <p className="text-sm font-bold">
                  Belum ada peserta yang mengerjakan test.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-50">
                {results.map((result, i) => {
                  const score = Number(result.score);
                  const isPassed = score >= PASS_SCORE;
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-500 flex-shrink-0">
                        {(page - 1) * 10 + i + 1}{" "}
                        {/* ✅ nomor urut lintas halaman */}
                      </div>
                      <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {result.user.profilePhoto ? (
                          <img
                            src={result.user.profilePhoto}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-black text-orange-600">
                            {result.user.fullName?.[0] ??
                              result.user.email[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-zinc-900 truncate">
                          {result.user.fullName ?? "—"}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-medium truncate">
                          {result.user.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "text-lg font-black",
                            isPassed ? "text-emerald-600" : "text-red-500",
                          )}
                        >
                          {score.toFixed(0)}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-bold">
                          / 100
                        </p>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                          isPassed
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500",
                        )}
                      >
                        {isPassed ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {isPassed ? "Lulus" : "Tidak Lulus"}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* PAGINATION */}
        <div className="mt-12">
          {!!data?.meta && (
            <PaginationSection
              meta={data.meta}
              onChangePage={(page) => setPage(page)}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
