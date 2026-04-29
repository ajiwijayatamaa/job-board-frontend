import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  CheckCircle,
  User,
  XCircle,
  Target,
  Info,
} from "lucide-react";
import { Link, redirect, useParams, useNavigate } from "react-router";
import AdminSidebar from "~/components/admin/admin-sidebar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SidebarProvider } from "~/components/ui/sidebar";
import useGetAnswersByResult from "~/hooks/api/useGetAnswersByResult";
import { cn } from "~/lib/utils";
import { useAuth } from "~/stores/useAuth";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ADMIN") return redirect("/");
};

export default function AdminTestAnswerDetailPage() {
  const { testResultId } = useParams<{ testResultId: string }>();
  const numericId = Number(testResultId);
  const navigate = useNavigate();

  const { data, isLoading } = useGetAnswersByResult(numericId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-[#1D5FAD]/10 border-t-[#1D5FAD] rounded-full animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Menganalisis Jawaban...
        </p>
      </div>
    );
  }

  if (!data) return null;
  console.log(data.answers);

  const score = Number(data.score);
  const correctCount = data.answers.filter((a) => {
    const selectedOpt = a.question.options.find(
      (opt) => String(opt.id) === String(a.selectedAnswer),
    );
    return selectedOpt?.isCorrect === true;
  }).length;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F8FAFC] w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Navigasi Kembali */}
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="-ml-2 text-slate-400 hover:text-[#0F2342] hover:bg-slate-200/50 font-bold uppercase text-[10px] tracking-widest transition-all"
            >
              <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Kembali ke Daftar
            </Button>

            {/* Judul Halaman */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1D5FAD]/10 rounded-xl">
                <Target className="w-5 h-5 text-[#1D5FAD]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Laporan Hasil Ujian
                </span>
                <h1 className="text-3xl font-black text-[#0F2342] uppercase italic tracking-tighter">
                  Detail <span className="text-[#1D5FAD]">Jawaban</span>
                </h1>
              </div>
            </div>

            {/* Kartu Profil & Skor Utama */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden border-t-4 border-t-[#1D5FAD]">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                  {/* Foto Profil */}
                  <div className="w-20 h-20 rounded-[2rem] bg-[#F4F8FF] border-2 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                    {data.user.profilePhoto ? (
                      <img
                        src={data.user.profilePhoto}
                        alt={data.user.fullName ?? ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-[#1D5FAD]" />
                    )}
                  </div>

                  {/* Informasi Kandidat */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-black text-[#0F2342] uppercase italic leading-tight truncate">
                      {data.user.fullName ?? "Kandidat Anonim"}
                    </h2>
                    <p className="text-sm text-slate-400 font-bold mt-1">
                      {data.user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <Badge
                        className={cn(
                          "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border-none shadow-sm",
                          data.isPassed
                            ? "bg-teal-50 text-teal-600"
                            : "bg-rose-50 text-rose-500",
                        )}
                      >
                        {data.isPassed ? "Lulus Kualifikasi" : "Tidak Lulus"}
                      </Badge>
                    </div>
                  </div>

                  {/* Nilai Besar */}
                  <div className="flex flex-col items-center md:items-end shrink-0 bg-[#0F2342] p-6 rounded-[2rem] text-white min-w-[140px]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300/80 mb-1">
                      Total Skor
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black italic tracking-tighter">
                        {score.toFixed(0)}
                      </span>
                      <span className="text-blue-300/40 font-bold text-sm">
                        / 100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ringkasan Statistik */}
                <div className="mt-10 grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Benar",
                      value: correctCount,
                      color: "text-teal-600",
                      bg: "bg-teal-50",
                    },
                    {
                      label: "Salah",
                      value: data.answers.length - correctCount,
                      color: "text-rose-500",
                      bg: "bg-rose-50",
                    },
                    {
                      label: "Soal",
                      value: data.answers.length,
                      color: "text-[#0F2342]",
                      bg: "bg-slate-50",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={cn(
                        "rounded-2xl p-4 text-center border border-transparent hover:border-slate-100 transition-all",
                        stat.bg,
                      )}
                    >
                      <p
                        className={cn(
                          "text-3xl font-black leading-none mb-1",
                          stat.color,
                        )}
                      >
                        {stat.value}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daftar Jawaban Per Soal */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#0F2342] flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-[#1D5FAD]" />
                  Analisis Jawaban Per Soal
                </h3>
              </div>

              {data.answers.map((answer, i) => {
                const selectedOption = answer.question.options.find(
                  (opt) => String(opt.id) === String(answer.selectedAnswer),
                );
                const isCorrect = selectedOption?.isCorrect === true;
                return (
                  <motion.div
                    key={answer.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "p-6 rounded-[1.5rem] border-2 transition-all",
                      isCorrect
                        ? "border-teal-100 bg-white"
                        : "border-rose-100 bg-white shadow-sm",
                    )}
                  >
                    {/* Header Soal */}
                    <div className="flex items-start gap-4 mb-5">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black shadow-sm",
                          isCorrect
                            ? "bg-teal-500 text-white"
                            : "bg-rose-500 text-white",
                        )}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm font-bold text-[#0F2342] leading-relaxed pt-1">
                        {answer.question.questionText}
                      </p>
                      <div className="ml-auto">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-teal-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-500" />
                        )}
                      </div>
                    </div>

                    {/* Opsi Jawaban */}
                    <div className="grid grid-cols-1 gap-2 ml-12">
                      {answer.question.options.map((opt) => {
                        const isSelected =
                          String(opt.id) === String(answer.selectedAnswer);
                        const isCorrectOpt = opt.isCorrect;

                        return (
                          <div
                            key={opt.id}
                            className={cn(
                              "px-5 py-3 rounded-xl text-[13px] font-medium flex items-center justify-between border transition-all",
                              isCorrectOpt
                                ? "bg-teal-50 border-teal-200 text-teal-800 font-bold"
                                : isSelected && !isCorrectOpt
                                  ? "bg-rose-50 border-rose-200 text-rose-700 font-bold"
                                  : "bg-[#F8FAFC] text-slate-500 border-slate-100",
                            )}
                          >
                            <span>{opt.optionText}</span>

                            <div className="flex gap-2">
                              {isCorrectOpt && (
                                <Badge className="bg-teal-500/10 text-teal-600 border-none text-[9px] font-black uppercase px-2 py-0.5">
                                  Jawaban Benar
                                </Badge>
                              )}
                              {isSelected && !isCorrectOpt && (
                                <Badge className="bg-rose-500/10 text-rose-600 border-none text-[9px] font-black uppercase px-2 py-0.5">
                                  Pilihan Peserta
                                </Badge>
                              )}
                              {isSelected && isCorrectOpt && (
                                <Badge className="bg-teal-500 text-white border-none text-[9px] font-black uppercase px-2 py-0.5">
                                  Terpilih ✓
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
}
