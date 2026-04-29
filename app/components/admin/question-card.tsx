import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { CreatePreSelectionTestSchema } from "~/schema/pre-selection-test";

const OPTION_LABELS = ["A", "B", "C", "D", "E"];

interface Props {
  questionIndex: number;
}

export default function QuestionCard({ questionIndex }: Props) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreatePreSelectionTestSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const options = watch(`questions.${questionIndex}.options`);

  const handleSelectCorrect = (optionIndex: number) => {
    const selectedText = options[optionIndex]?.optionText ?? "";
    fields.forEach((_, i) => {
      setValue(
        `questions.${questionIndex}.options.${i}.isCorrect`,
        i === optionIndex,
        { shouldValidate: true },
      );
    });
    setValue(`questions.${questionIndex}.correctAnswer`, selectedText, {
      shouldValidate: true,
    });
  };

  const qErrors = errors.questions?.[questionIndex];

  return (
    <div className="space-y-8">
      {/* --- Section: Question Text --- */}
      <Field data-invalid={!!qErrors?.questionText}>
        <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">
          Pertanyaan Strategis *
        </FieldLabel>
        <textarea
          {...register(`questions.${questionIndex}.questionText`)}
          rows={4}
          className="w-full rounded-2xl border border-[#D1DFF0] bg-white px-5 py-4 text-sm font-semibold text-[#0F2342] placeholder:text-slate-300 focus:border-[#1D5FAD] focus:outline-none focus:ring-4 focus:ring-[#1D5FAD]/5 transition-all resize-none shadow-sm"
          placeholder="Masukkan narasi atau teks pertanyaan di sini..."
        />
        {qErrors?.questionText && (
          <FieldError errors={[qErrors.questionText]} />
        )}
      </Field>

      {/* --- Section: Options --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Opsi Jawaban & Kunci *
          </span>
          {fields.length < 5 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append({ optionText: "", isCorrect: false })}
              className="text-[10px] font-black uppercase text-[#1D5FAD] hover:bg-[#1D5FAD]/5 h-auto py-2 px-3 rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Tambah Opsi
            </Button>
          )}
        </div>

        <div className="grid gap-3">
          {fields.map((field, optionIndex) => {
            const isCorrect = options?.[optionIndex]?.isCorrect ?? false;
            return (
              <div key={field.id} className="flex items-center gap-4 group">
                {/* Checkbox/Circle Button */}
                <button
                  type="button"
                  onClick={() => handleSelectCorrect(optionIndex)}
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black transition-all border-2",
                    isCorrect
                      ? "bg-[#1D5FAD] border-[#1D5FAD] text-white shadow-lg shadow-[#1D5FAD]/20 scale-105"
                      : "bg-white border-[#E2EAF4] text-slate-400 hover:border-[#1D5FAD] hover:text-[#1D5FAD]",
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{OPTION_LABELS[optionIndex]}</span>
                  )}
                </button>

                {/* Input Text */}
                <div className="flex-1 relative">
                  <Input
                    {...register(
                      `questions.${questionIndex}.options.${optionIndex}.optionText`,
                      {
                        onChange: (e) => {
                          // ✅ jika opsi ini adalah jawaban benar, sync correctAnswer
                          if (isCorrect) {
                            setValue(
                              `questions.${questionIndex}.correctAnswer`,
                              e.target.value,
                              { shouldValidate: true },
                            );
                          }
                        },
                      },
                    )}
                    placeholder={`Ketik opsi ${OPTION_LABELS[optionIndex]}...`}
                    className={cn(
                      "h-12 rounded-xl text-sm font-bold border-[#D1DFF0] transition-all pr-12",
                      isCorrect
                        ? "border-[#1D5FAD] bg-[#F4F8FF] text-[#0F2342] ring-2 ring-[#1D5FAD]/5"
                        : "focus-visible:border-[#1D5FAD] focus-visible:ring-[#1D5FAD]/5",
                    )}
                  />
                  {/* Delete Button inside Input for cleanliness */}
                  {fields.length > 2 && (
                    <button
                      type="button"
                      onClick={() => remove(optionIndex)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {qErrors?.correctAnswer && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <div className="w-1 h-1 bg-rose-500 rounded-full" />
            <p className="text-[11px] text-rose-500 font-bold uppercase tracking-tight">
              {qErrors.correctAnswer.message as string}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
