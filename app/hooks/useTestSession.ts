import { useEffect, useRef, useState } from "react";

const DURATION = 30 * 60; // 30 menit dalam detik

interface UseTestSessionProps {
  jobId: number;
  isTestReady: boolean; // true saat data soal dari API sudah ada
  onTimeUp: () => void; // callback saat waktu habis
}

export const useTestSession = ({
  jobId,
  isTestReady,
  onTimeUp,
}: UseTestSessionProps) => {
  // key sessionStorage unik per jobId
  // sessionStorage otomatis bersih saat tab ditutup — cocok untuk sesi test
  const SESSION_KEY = `test-session-${jobId}`;

  // ── INISIALISASI ────────────────────────────────────────────────────────────

  const getInitialSession = () => {
    if (typeof window === "undefined") return null; // ✅ guard SSR
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) return JSON.parse(saved);
    return null;
  };

  const savedSession = getInitialSession();

  // jika ada sesi tersimpan → hitung sisa waktu dari startTime
  // jika tidak ada → mulai dari DURATION penuh
  const calcTimeLeft = () => {
    if (!savedSession?.startTime) return DURATION;
    const elapsed = Math.floor(
      (Date.now() - new Date(savedSession.startTime).getTime()) / 1000,
    );
    const remaining = DURATION - elapsed;
    // jika sisa waktu sudah habis atau negatif → return 0
    return Math.max(0, remaining);
  };

  const [answers, setAnswers] = useState<Record<number, string>>(
    savedSession?.answers ?? {},
  );
  const [timeLeft, setTimeLeft] = useState<number>(calcTimeLeft);
  const hasSubmitted = useRef(false);

  // ── SIMPAN SESI KE sessionStorage ──────────────────────────────────────────

  // simpan startTime saat test pertama kali dimulai (tidak ada sesi sebelumnya)
  useEffect(() => {
    if (!isTestReady) return;

    const existing = sessionStorage.getItem(SESSION_KEY);
    if (!existing) {
      // test baru dimulai → catat waktu mulai sekarang
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          startTime: new Date().toISOString(),
          answers: {},
        }),
      );
    }
  }, [isTestReady, SESSION_KEY]);

  // update answers di sessionStorage setiap kali user memilih jawaban
  useEffect(() => {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (!existing) return;

    const parsed = JSON.parse(existing);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...parsed, answers }));
  }, [answers, SESSION_KEY]);

  // ── TIMER COUNTDOWN ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isTestReady || hasSubmitted.current) return;

    // jika saat load sudah habis waktu → langsung submit
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTestReady]); // hanya jalankan ulang saat isTestReady berubah

  // ── ANSWER HANDLER ──────────────────────────────────────────────────────────

  const selectAnswer = (questionId: number, optionText: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionText }));
  };

  // ── CLEAR SESSION ───────────────────────────────────────────────────────────

  // dipanggil setelah submit berhasil agar sesi tidak tersisa
  const clearSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
    hasSubmitted.current = true;
  };

  // ── DERIVED VALUES ──────────────────────────────────────────────────────────

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const isWarning = timeLeft <= 300; // 5 menit terakhir
  const answeredCount = Object.keys(answers).length;

  return {
    answers,
    timeLeft,
    minutes,
    seconds,
    isWarning,
    answeredCount,
    selectAnswer,
    clearSession,
    hasSubmitted,
  };
};
