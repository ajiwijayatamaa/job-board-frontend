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
    <div className="space-y-5">
      <Field data-invalid={!!qErrors?.questionText}>
        <FieldLabel className="text-xs font-black uppercase tracking-widest text-zinc-400">
          Teks Soal *
        </FieldLabel>
        <textarea
          {...register(`questions.${questionIndex}.questionText`)}
          rows={3}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
          placeholder="Tulis pertanyaan di sini..."
        />
        {qErrors?.questionText && (
          <FieldError errors={[qErrors.questionText]} />
        )}
      </Field>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
            Opsi Jawaban *
          </span>
          {fields.length < 5 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append({ optionText: "", isCorrect: false })}
              className="text-[10px] font-black uppercase text-orange-500 hover:text-orange-600 h-auto py-1"
            >
              <Plus className="w-3 h-3 mr-1" /> Tambah Opsi
            </Button>
          )}
        </div>

        {fields.map((field, optionIndex) => {
          const isCorrect = options?.[optionIndex]?.isCorrect ?? false;
          return (
            <div key={field.id} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSelectCorrect(optionIndex)}
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                  isCorrect
                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200",
                )}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span>{OPTION_LABELS[optionIndex]}</span>
                )}
              </button>
              <Input
                {...register(
                  `questions.${questionIndex}.options.${optionIndex}.optionText`,
                )}
                placeholder={`Opsi ${OPTION_LABELS[optionIndex]}`}
                className={cn(
                  "flex-1 h-10 rounded-xl text-sm font-medium border-zinc-200",
                  isCorrect &&
                    "border-orange-400 bg-orange-50/50 focus-visible:border-orange-500",
                )}
              />
              {fields.length > 2 && (
                <button
                  type="button"
                  onClick={() => remove(optionIndex)}
                  className="flex-shrink-0 text-zinc-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        {qErrors?.correctAnswer && (
          <p className="text-xs text-red-500 font-medium mt-1">
            {qErrors.correctAnswer.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
