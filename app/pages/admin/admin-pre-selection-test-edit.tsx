import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Link, Navigate, redirect, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import QuestionCard from "@/components/admin/question-card";
import QuestionNavigator from "@/components/shared/question-navigator";
import useGetTestByJobId from "~/hooks/api/useGetTestByJobId";
import useUpdateTest from "~/hooks/api/useUpdateTest";
import {
  createPreSelectionTestSchema,
  type CreatePreSelectionTestSchema,
} from "~/schema/pre-selection-test";
import { useAuth } from "~/stores/useAuth";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ADMIN") return redirect("/");
};

export default function PreSelectionTestEditPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const numericJobId = Number(jobId);
  const [currentQ, setCurrentQ] = useState(0);

  const { data: existingTest, isLoading } = useGetTestByJobId(numericJobId);

  const form = useForm<CreatePreSelectionTestSchema>({
    resolver: zodResolver(createPreSelectionTestSchema),
    defaultValues: {
      jobId: numericJobId,
      title: "",
      passingScore: 75,
      questions: [],
    },
  });

  useEffect(() => {
    if (!existingTest) return;
    form.reset({
      jobId: numericJobId,
      title: existingTest.title,
      passingScore: existingTest.passingScore,
      questions: existingTest.questions.map((q) => ({
        questionText: q.questionText,
        correctAnswer: q.correctAnswer,
        options: q.options.map((o) => ({
          optionText: o.optionText,
          isCorrect: o.isCorrect,
        })),
      })),
    });
  }, [existingTest]);

  const { mutateAsync: updateTest, isPending } = useUpdateTest(
    existingTest?.id ?? 0,
    numericJobId,
  );

  const questions = useWatch({ control: form.control, name: "questions" });
  const answeredMap =
    questions?.map(
      (q) => q.questionText.length > 0 && q.options.some((o) => o.isCorrect),
    ) ?? [];

  const onSubmit = async (data: CreatePreSelectionTestSchema) => {
    await updateTest({
      title: data.title,
      passingScore: data.passingScore, // ← kirim ke BE
      questions: data.questions,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (!existingTest) {
    return (
      <Navigate to={`/admin/jobs/${jobId}/pre-selection-test/create`} replace />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        <Button
          variant="ghost"
          asChild
          className="mb-6 -ml-2 text-zinc-500 hover:text-zinc-900 font-bold uppercase text-[10px] tracking-widest"
        >
          <Link to={`/admin/jobs/${jobId}`}>
            <ArrowLeft className="mr-2 h-3 w-3" /> Kembali ke Job
          </Link>
        </Button>

        <div className="flex items-center gap-2 mb-2">
          <ClipboardList className="w-4 h-4 text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Pre-Selection Test
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic mb-1">
          Edit <span className="text-orange-500">Test</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium mb-8">
          Perbarui soal-soal pre-selection test.
        </p>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
                <CardTitle className="text-sm font-black uppercase italic tracking-tight text-zinc-900">
                  Informasi Test
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Field data-invalid={!!form.formState.errors.title}>
                  <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                    Judul Test *
                  </FieldLabel>
                  <Input
                    {...form.register("title")}
                    className="h-12 rounded-xl border-zinc-200 focus-visible:border-orange-500 font-bold"
                    placeholder="Contoh: Frontend Developer Assessment"
                  />
                  {form.formState.errors.title && (
                    <FieldError errors={[form.formState.errors.title]} />
                  )}
                </Field>

                {/* ── Nilai Minimum Kelulusan ── */}
                <Field data-invalid={!!form.formState.errors.passingScore}>
                  <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
                    Nilai Minimum Kelulusan (0–100) *
                  </FieldLabel>
                  <Input
                    {...(form.register("passingScore"),
                    { valueAsNumber: true })}
                    type="number"
                    min={0}
                    max={100}
                    className="h-12 rounded-xl border-zinc-200 focus-visible:border-orange-500 font-bold"
                    placeholder="Contoh: 75"
                  />
                  {form.formState.errors.passingScore && (
                    <FieldError errors={[form.formState.errors.passingScore]} />
                  )}
                </Field>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-sm font-black uppercase italic tracking-tight text-zinc-900">
                    Soal {currentQ + 1} <span className="text-zinc-300">/</span>{" "}
                    <span className="text-orange-500">25</span>
                  </span>
                  <span className="text-[10px] font-black text-zinc-400">
                    {answeredMap.filter(Boolean).length} soal terisi
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <QuestionNavigator
                  total={25}
                  current={currentQ}
                  answeredMap={answeredMap}
                  onSelect={setCurrentQ}
                />
                <div className="border-t border-zinc-100 pt-6">
                  <QuestionCard questionIndex={currentQ} />
                </div>
                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                    disabled={currentQ === 0}
                    className="font-black uppercase text-[10px] tracking-widest"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Sebelumnya
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentQ((p) => Math.min(24, p + 1))}
                    disabled={currentQ === 24}
                    className="bg-zinc-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-xl"
                  >
                    Selanjutnya <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-zinc-900 hover:bg-black text-white rounded-2xl h-14 shadow-xl shadow-zinc-200 font-black uppercase text-xs tracking-[0.2em] italic"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4 text-orange-500" /> Perbarui
                  Test
                </>
              )}
            </Button>
          </form>
        </FormProvider>
      </motion.div>
    </div>
  );
}
