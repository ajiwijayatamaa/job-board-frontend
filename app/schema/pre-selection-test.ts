import { z } from "zod";

// ── OPTION ────────────────────────────────────────────────
export const testOptionSchema = z.object({
  optionText: z.string().min(1, "Teks opsi tidak boleh kosong"),
  isCorrect: z.boolean(),
});

// ── QUESTION ──────────────────────────────────────────────
export const testQuestionSchema = z
  .object({
    questionText: z.string().min(1, "Teks soal tidak boleh kosong"),
    correctAnswer: z
      .string()
      .min(1, "Pilih salah satu opsi sebagai jawaban benar"),
    options: z
      .array(testOptionSchema)
      .min(2, "Minimal 2 opsi jawaban")
      .max(5, "Maksimal 5 opsi jawaban"),
  })
  .refine((data) => data.options.some((o) => o.isCorrect), {
    message: "Pilih salah satu opsi sebagai jawaban benar",
    path: ["correctAnswer"],
  });

// ── CREATE ────────────────────────────────────────────────
export const createPreSelectionTestSchema = z.object({
  jobId: z.number(),
  title: z.string().min(1, "Judul tidak boleh kosong"),
  questions: z
    .array(testQuestionSchema)
    .length(25, "Soal harus berjumlah tepat 25"),
});

export type CreatePreSelectionTestSchema = z.infer<
  typeof createPreSelectionTestSchema
>;

// ── UPDATE ────────────────────────────────────────────────
export const updatePreSelectionTestSchema = z.object({
  title: z.string().min(1, "Judul tidak boleh kosong").optional(),
  questions: z
    .array(testQuestionSchema)
    .length(25, "Soal harus berjumlah tepat 25")
    .optional(),
});

export type UpdatePreSelectionTestSchema = z.infer<
  typeof updatePreSelectionTestSchema
>;

// ── SUBMIT (USER) ─────────────────────────────────────────
export const answerItemSchema = z.object({
  questionId: z.number(),
  selectedAnswer: z.string().min(1, "Jawaban tidak boleh kosong"),
});

export const submitTestSchema = z.object({
  jobId: z.number(),
  answers: z.array(answerItemSchema).length(25, "Semua soal harus dijawab"),
});

export type SubmitTestSchema = z.infer<typeof submitTestSchema>;
export type AnswerItemSchema = z.infer<typeof answerItemSchema>;

// bisa dipakai di hook maupun pag tanpa perlu mendefinisikan ulang di masing-masing file
export const buildDefaultOptions = () => [
  { optionText: "", isCorrect: false },
  { optionText: "", isCorrect: false },
  { optionText: "", isCorrect: false },
  { optionText: "", isCorrect: false },
];

export const buildDefaultQuestions = () =>
  Array.from({ length: 25 }, () => ({
    questionText: "",
    correctAnswer: "",
    options: buildDefaultOptions(),
  }));

export const buildDefaultTestForm = (
  jobId: number,
): CreatePreSelectionTestSchema => ({
  jobId,
  title: "",
  questions: buildDefaultQuestions(),
});
