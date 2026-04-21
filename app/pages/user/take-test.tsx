import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { redirect, useParams } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Send,
  AlertTriangle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import useTakeTest from "~/hooks/api/useTakeTest";
import useSubmitTest from "~/hooks/api/useSubmitTest";
import { useTestSession } from "~/hooks/useTestSession";
import { useAuth } from "~/stores/useAuth";
import { toast } from "sonner";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "USER") return redirect("/");
};

export default function TakeTestPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const numericJobId = Number(jobId);

  const { data: test, isLoading } = useTakeTest(numericJobId);
  const { mutate: submitTest, isPending } = useSubmitTest(numericJobId);

  const [currentQ, setCurrentQ] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = () => {
    if (!test) return;

    // cek soal mana yang belum dijawab
    const unanswered = test.questions
      .map((q, i) => ({ index: i + 1, id: q.id }))
      .filter((q) => !answers[q.id]);

    if (unanswered.length > 0) {
      const nomorSoal = unanswered.map((q) => q.index).join(", ");
      toast.error(`Soal ${nomorSoal} belum dijawab`);
      setShowConfirm(false);
      return;
    }

    clearSession();
    submitTest({
      jobId: numericJobId,
      answers: test.questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: answers[q.id],
      })),
    });
  };

  const {
    answers,
    minutes,
    seconds,
    isWarning,
    answeredCount,
    selectAnswer,
    clearSession,
    hasSubmitted,
  } = useTestSession({
    jobId: numericJobId,
    isTestReady: !!test,
    // saat waktu habis → langsung submit tanpa konfirmasi
    onTimeUp: () => {
      if (!hasSubmitted.current) handleSubmit();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!test) return null;

  const question = test.questions[currentQ];
  const selectedAnswer = answers[question.id];

  return (
    <div className="min-h-screen bg-zinc-50/50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-zinc-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Pre-Selection Test
            </p>
            <p className="text-sm font-black text-zinc-900 truncate max-w-xs">
              {test.title}
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-lg tabular-nums transition-colors",
              isWarning
                ? "bg-red-50 text-red-600 animate-pulse"
                : "bg-zinc-900 text-white",
            )}
          >
            <Clock className="w-4 h-4" />
            {minutes}:{seconds}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-zinc-100">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${(answeredCount / 25) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 lg:p-10">
        {/* Question dots */}
        <div className="flex flex-wrap gap-1.5 mb-8">
          {test.questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentQ(i)}
              className={cn(
                "w-8 h-8 rounded-lg text-[10px] font-black transition-all border",
                i === currentQ
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : answers[q.id]
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden mb-6">
              <CardHeader className="bg-zinc-900 text-white px-8 py-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Soal {currentQ + 1} dari 25
                </p>
                <CardTitle className="text-base font-bold leading-relaxed text-white">
                  {question.questionText}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {question.options.map((option, i) => {
                  const isSelected = selectedAnswer === option.optionText;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      // pakai selectAnswer dari hook, bukan setAnswers langsung
                      onClick={() =>
                        selectAnswer(question.id, option.optionText)
                      }
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all font-medium text-sm",
                        isSelected
                          ? "border-orange-500 bg-orange-50 text-orange-900"
                          : "border-zinc-100 bg-zinc-50/50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50",
                      )}
                    >
                      <span
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0",
                          isSelected
                            ? "bg-orange-500 text-white"
                            : "bg-white text-zinc-400 border border-zinc-200",
                        )}
                      >
                        {["A", "B", "C", "D", "E"][i]}
                      </span>
                      {option.optionText}
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
            disabled={currentQ === 0}
            className="font-black uppercase text-[10px] tracking-widest"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Sebelumnya
          </Button>
          <span className="text-xs font-black text-zinc-400">
            {answeredCount}/25 dijawab
          </span>
          {currentQ < 24 ? (
            <Button
              type="button"
              onClick={() => setCurrentQ((p) => p + 1)}
              className="bg-zinc-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-xl"
            >
              Selanjutnya <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl"
            >
              <Send className="w-4 h-4 mr-2" /> Kumpulkan
            </Button>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl"
            >
              <AlertTriangle className="w-10 h-10 text-orange-500 mb-4" />
              <h2 className="text-xl font-black uppercase italic tracking-tight text-zinc-900 mb-2">
                Kumpulkan Jawaban?
              </h2>
              <p className="text-sm text-zinc-500 font-medium mb-2">
                Kamu sudah menjawab{" "}
                <strong className="text-zinc-900">{answeredCount}</strong> dari{" "}
                <strong className="text-zinc-900">25</strong> soal.
              </p>
              {answeredCount < 25 && (
                <p className="text-xs text-orange-600 font-bold mb-6">
                  ⚠ {25 - answeredCount} soal belum dijawab.
                </p>
              )}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-2xl font-black uppercase text-[10px]"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="flex-1 bg-zinc-900 text-white rounded-2xl font-black uppercase text-[10px]"
                >
                  {isPending ? "Mengirim..." : "Ya, Kumpulkan"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
