import QuestionCard from "@/components/admin/question-card";
import QuestionNavigator from "@/components/shared/question-navigator";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Save,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { FormProvider, useWatch } from "react-hook-form";
import { Link, redirect, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import useCreateTest from "~/hooks/api/useCreateTest";

import { useTestDraft } from "@/hooks/useTestDraft";
import { useAuth } from "~/stores/useAuth";
import { cn } from "~/lib/utils";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ADMIN") return redirect("/");
};

export default function PreSelectionTestCreatePage() {
  const { jobId } = useParams<{ jobId: string }>();
  const numericJobId = Number(jobId);
  const [currentQ, setCurrentQ] = useState(0);

  const { mutateAsync: createTest, isPending } = useCreateTest(numericJobId);

  const { form, parsedDraft, errorQuestions, onSubmit, onError, clearDraft } =
    useTestDraft({ jobId: numericJobId, createTest });

  const questions = useWatch({ control: form.control, name: "questions" });
  const answeredMap =
    questions?.map(
      (q) => q.questionText.length > 0 && q.options.some((o) => o.isCorrect),
    ) ?? [];

  const handleError = (errors: any) => {
    onError(errors);
    if (errors.questions) {
      const firstErrorIndex = errors.questions.findIndex(
        (_: any, i: number) => errors.questions[i],
      );
      if (firstErrorIndex !== -1) setCurrentQ(firstErrorIndex);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F5FB] p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        {/* --- Breadcrumb Style Back Button --- */}
        <Button
          variant="ghost"
          asChild
          className="mb-8 -ml-2 text-slate-400 hover:text-[#1D5FAD] font-bold uppercase text-[10px] tracking-[0.2em] transition-colors"
        >
          <Link to={`/admin/jobs/${jobId}`}>
            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Kembali ke Manajemen
            Lowongan
          </Link>
        </Button>

        {/* --- Header Section --- */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-[#1D5FAD]/10 rounded-lg">
                <ClipboardList className="w-4 h-4 text-[#1D5FAD]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Assessment Configuration
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#0F2342] mb-2">
              Setup <span className="text-[#1D5FAD]">Pre-Selection Test</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Rancang 25 pertanyaan strategis untuk menyaring kandidat terbaik.
            </p>
          </div>

          {/* Progress Summary Pill */}
          <div className="bg-white border border-[#E2EAF4] rounded-2xl px-5 py-3 shadow-sm flex items-center gap-4">
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Progress Soal
              </p>
              <p className="text-xl font-black text-[#0F2342]">
                {answeredMap.filter(Boolean).length}{" "}
                <span className="text-slate-300">/ 25</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-[#1D5FAD] flex items-center justify-center relative">
              <span className="text-[10px] font-black text-[#1D5FAD]">
                {Math.round((answeredMap.filter(Boolean).length / 25) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* --- Draft Alert (Teal Style) --- */}
        {parsedDraft && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-teal-50 border border-teal-100 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-teal-500" />
              <p className="text-xs font-bold text-teal-700">
                Sesi sebelumnya dipulihkan secara otomatis dari draf lokal.
              </p>
            </div>
            <button
              type="button"
              onClick={clearDraft}
              className="text-[10px] font-black uppercase tracking-widest text-teal-600/50 hover:text-rose-500 transition-colors"
            >
              Reset Progress
            </button>
          </motion.div>
        )}

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, handleError)}
            className="space-y-8"
          >
            {/* --- Card: Informasi Utama --- */}
            <Card className="border border-[#E2EAF4] shadow-none rounded-[2rem] bg-white overflow-hidden transition-all hover:border-[#D1DFF0]">
              <CardHeader className="border-b border-[#F4F8FF] bg-[#F4F8FF]/50 px-8 py-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.1em] text-[#0F2342]">
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Field data-invalid={!!form.formState.errors.title}>
                      <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                        Judul Modul Test *
                      </FieldLabel>
                      <Input
                        {...form.register("title")}
                        className="h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/10 focus-visible:border-[#1D5FAD] font-bold text-[#0F2342] placeholder:text-slate-300"
                        placeholder="Contoh: Technical Assessment - Senior Developer"
                      />
                      {form.formState.errors.title && (
                        <FieldError errors={[form.formState.errors.title]} />
                      )}
                    </Field>
                  </div>
                  <div>
                    <Field data-invalid={!!form.formState.errors.passingScore}>
                      <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                        Passing Score (0-100) *
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          {...form.register("passingScore", {
                            valueAsNumber: true,
                          })}
                          type="number"
                          className="h-12 rounded-xl border-[#D1DFF0] focus-visible:ring-[#1D5FAD]/10 focus-visible:border-[#1D5FAD] font-black text-[#1D5FAD] pr-10"
                          placeholder="75"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-300">
                          %
                        </span>
                      </div>
                      {form.formState.errors.passingScore && (
                        <FieldError
                          errors={[form.formState.errors.passingScore]}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* --- Card: Editor Soal --- */}
            <Card className="border border-[#E2EAF4] shadow-none rounded-[2rem] bg-white overflow-hidden transition-all hover:border-[#D1DFF0]">
              <CardHeader className="border-b border-[#F4F8FF] bg-[#F4F8FF]/50 px-8 py-6">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase tracking-[0.1em] text-[#0F2342]">
                      Question Editor
                    </span>
                    <span className="px-2 py-0.5 bg-[#1D5FAD] text-white text-[10px] font-black rounded-md">
                      {currentQ + 1} / 25
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Navigator dengan styling admin-job-list (dashed border, light bg) */}
                <div className="p-6 bg-[#F8FAFD] rounded-[1.5rem] border border-dashed border-[#C8D9EE]">
                  <QuestionNavigator
                    total={25}
                    current={currentQ}
                    answeredMap={answeredMap}
                    onSelect={setCurrentQ}
                  />
                </div>

                <div className="pt-2">
                  <QuestionCard key={currentQ} questionIndex={currentQ} />
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-[#F0F5FB]">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                    disabled={currentQ === 0}
                    className="rounded-xl h-11 px-6 border-[#D1DFF0] text-slate-600 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => setCurrentQ((p) => Math.min(24, p + 1))}
                      disabled={currentQ === 24}
                      className="bg-white border border-[#1D5FAD] text-[#1D5FAD] hover:bg-[#F4F8FF] rounded-xl h-11 px-6 font-black uppercase text-[10px] tracking-widest transition-all"
                    >
                      Next Question <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* --- Error Summary (Rose/Closed Style) --- */}
            {errorQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 border border-rose-100 rounded-[2rem] p-8"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-rose-500 rounded-lg shadow-lg shadow-rose-200">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#0F2342] uppercase italic">
                      Validasi Gagal
                    </p>
                    <p className="text-[11px] font-bold text-rose-500">
                      {errorQuestions.length} soal memerlukan perhatian Anda
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {errorQuestions.map((index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentQ(index)}
                      className="px-4 py-2 bg-white border border-rose-200 hover:border-rose-500 text-rose-600 text-[10px] font-black rounded-xl transition-all shadow-sm"
                    >
                      Soal #{index + 1}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  Semua 25 soal wajib diisi dengan teks pertanyaan dan minimal
                  satu pilihan jawaban yang ditandai sebagai benar sebelum dapat
                  disimpan ke server.
                </p>
              </motion.div>
            )}

            {/* --- Final Submit Button (Professional Blue) --- */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#1D5FAD] hover:bg-[#0F2342] text-white rounded-[1.5rem] h-16 shadow-xl shadow-[#1D5FAD]/20 font-black uppercase text-xs tracking-[0.3em] transition-all group"
            >
              {isPending ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Mempublikasikan Test...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
                  <span>Simpan Test</span>
                </div>
              )}
            </Button>
          </form>
        </FormProvider>
      </motion.div>
    </div>
  );
}
