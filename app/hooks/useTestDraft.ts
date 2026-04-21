import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPreSelectionTestSchema,
  buildDefaultTestForm,
  type CreatePreSelectionTestSchema,
} from "~/schema/pre-selection-test";

interface UseTestDraftProps {
  jobId: number;
  createTest: (data: CreatePreSelectionTestSchema) => Promise<any>;
}

export const useTestDraft = ({ jobId, createTest }: UseTestDraftProps) => {
  // key localStorage unik per jobId
  // agar draft job A tidak tercampur dengan draft job B
  const DRAFT_KEY = `pre-selection-test-draft-${jobId}`;

  const [errorQuestions, setErrorQuestions] = useState<number[]>([]);

  // coba baca draft dari localStorage saat pertama kali hook dipakai
  const savedDraft = localStorage.getItem(DRAFT_KEY);
  const parsedDraft: CreatePreSelectionTestSchema | null = savedDraft
    ? JSON.parse(savedDraft)
    : null;

  const form = useForm<CreatePreSelectionTestSchema>({
    resolver: zodResolver(createPreSelectionTestSchema),
    // jika ada draft → lanjut dari draft, jika tidak → mulai dari kosong
    defaultValues: parsedDraft ?? buildDefaultTestForm(jobId),
  });

  // auto-save ke localStorage setiap kali ada perubahan di form
  // unsubscribe otomatis saat komponen unmount agar tidak memory leak
  useEffect(() => {
    const subscription = form.watch((values) => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [form, DRAFT_KEY]);

  const onSubmit = async (data: CreatePreSelectionTestSchema) => {
    setErrorQuestions([]);
    await createTest(data);
    // hapus draft setelah berhasil submit agar tidak muncul lagi saat buka halaman baru
    localStorage.removeItem(DRAFT_KEY);
  };

  // dipanggil react-hook-form jika validasi Zod gagal saat klik Simpan
  const onError = (errors: any) => {
    if (!errors.questions) return;

    const errorIndexes: number[] = errors.questions
      .map((_: any, i: number) => (errors.questions[i] ? i : null))
      .filter((i: number | null) => i !== null);

    setErrorQuestions(errorIndexes);
  };

  // hapus draft dan reset form ke kondisi awal
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    form.reset(buildDefaultTestForm(jobId));
  };

  return {
    form,
    parsedDraft,
    errorQuestions,
    onSubmit,
    onError,
    clearDraft,
  };
};
