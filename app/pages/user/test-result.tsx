import { motion } from "framer-motion";
import { useLocation, useNavigate, redirect } from "react-router";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useAuth } from "~/stores/useAuth";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "USER") return redirect("/");
};

export default function TestResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Kalau masuk langsung tanpa state, redirect ke jobs
  if (state === null) {
    navigate("/jobs", { replace: true });
    return null;
  }

  const score: number = state?.score ?? 0;
  const passingScore: number = state?.passingScore ?? 75;
  const passed: boolean = state?.isPassed ?? false;
  const testResultId: number | null = state?.testResultId ?? null; // baca testResultId
  const jobId: number | null = state?.jobId ?? null; // baca jobId
  const displayScore = Math.round(score);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        {/* Score Card */}
        <div className="rounded-xl overflow-hidden border border-border card-shadow mb-6 bg-card">
          <div className="relative p-10 text-center">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />

            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-8">
              Hasil Pre-Selection Test
            </p>

            {/* Circular progress */}
            <div className="relative inline-flex items-center justify-center mb-8">
              <svg
                width="128"
                height="128"
                viewBox="0 0 128 128"
                className="-rotate-90"
              >
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  fill="none"
                  stroke="currentColor"
                  className="text-muted"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="54"
                  fill="none"
                  stroke={passed ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl font-bold text-foreground"
                >
                  {displayScore}
                </motion.span>
                <span className="text-xs font-bold text-muted-foreground">/ 100</span>
              </div>
            </div>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold uppercase text-xs tracking-widest mb-4",
                passed
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {passed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Lulus — Selamat!
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" /> Tidak Lulus
                </>
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-sm text-muted-foreground font-medium leading-relaxed"
            >
              {passed
                ? "Kamu memenuhi syarat minimum. Lanjutkan lamaranmu sekarang!"
                : `Skor minimum untuk lulus adalah ${passingScore}. Sayang sekali, kamu belum memenuhi syarat kali ini.`}
            </motion.p>
          </div>

          {/* Score breakdown */}
          <div className="border-t border-border px-10 py-5 flex justify-around bg-muted/30">
            {[
              { label: "Skor Kamu", value: `${displayScore}` },
              { label: "Minimum Lulus", value: `${passingScore}` },
              { label: "Status", value: passed ? "Lulus" : "Gagal" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-lg font-bold text-foreground">{value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col gap-3"
        >
          {/* ✅ Tombol lanjut lamar hanya muncul jika lulus dan testResultId tersedia */}
          {passed && testResultId && jobId && (
            <Button
              onClick={() =>
                navigate(`/jobs/${jobId}`, {
                  state: { testResultId }, // ← diteruskan ke job-detail
                })
              }
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-14 shadow-md font-bold uppercase text-xs tracking-widest italic"
            >
              Lanjut Lamar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          <Button
            onClick={() => navigate("/jobs")}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-14 shadow-md font-bold uppercase text-xs tracking-widest italic"
          >
            Lihat Lowongan Lain{" "}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/profile/applications")}
            className="w-full rounded-xl h-12 font-bold uppercase text-[10px] tracking-widest text-muted-foreground hover:text-foreground"
          >
            Lihat Status Lamaran
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
