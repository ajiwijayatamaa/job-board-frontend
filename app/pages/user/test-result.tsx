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

  const score: number = state?.score ?? 0;
  const passingScore: number = state?.passingScore ?? 75;
  const passed: boolean = state?.isPassed ?? false; // baca dari BE, bukan hitung sendiri
  const displayScore = Math.round(score);

  // Kalau masuk langsung tanpa state, redirect ke jobs
  if (state === null) {
    navigate("/jobs", { replace: true });
    return null;
  }

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-zinc-50/50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        {/* Score Card */}
        <div
          className={cn(
            "rounded-[2.5rem] overflow-hidden shadow-2xl mb-6",
            passed ? "bg-zinc-900" : "bg-zinc-900",
          )}
        >
          <div className="relative p-10 text-center">
            {/* Decorative circle */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />

            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-8">
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
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="54"
                  fill="none"
                  stroke={passed ? "#f97316" : "#ef4444"}
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
                  className="text-4xl font-black text-white"
                >
                  {displayScore}
                </motion.span>
                <span className="text-xs font-black text-zinc-400">/ 100</span>
              </div>
            </div>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black uppercase text-xs tracking-widest mb-4",
                passed
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-red-500/20 text-red-400",
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
              className="text-sm text-zinc-400 font-medium leading-relaxed"
            >
              {passed
                ? "Kamu memenuhi syarat minimum. Lamaranmu akan segera diproses oleh perusahaan."
                : `Skor minimum untuk lulus adalah ${passingScore}. Sayang sekali, kamu belum memenuhi syarat kali ini.`}
            </motion.p>
          </div>

          {/* Score breakdown */}
          <div className="border-t border-white/10 px-10 py-5 flex justify-around">
            {[
              { label: "Skor Kamu", value: `${displayScore}` },
              { label: "Minimum Lulus", value: `${passingScore}` },
              { label: "Status", value: passed ? "Lulus" : "Gagal" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-lg font-black text-white">{value}</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
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
          <Button
            onClick={() => navigate("/jobs")}
            className="w-full bg-zinc-900 hover:bg-black text-white rounded-2xl h-14 shadow-xl shadow-zinc-200 font-black uppercase text-xs tracking-[0.2em] italic"
          >
            Lihat Lowongan Lain{" "}
            <ArrowRight className="ml-2 h-4 w-4 text-orange-500" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/profile/applications")}
            className="w-full rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest text-zinc-400 hover:text-zinc-900"
          >
            Lihat Status Lamaran
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
