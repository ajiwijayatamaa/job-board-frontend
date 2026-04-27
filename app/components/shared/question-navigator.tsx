import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

interface Props {
  total: number;
  current: number;
  answeredMap: boolean[];
  onSelect: (index: number) => void;
}

export default function QuestionNavigator({
  total,
  current,
  answeredMap,
  onSelect,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const isAnswered = answeredMap[i];

        return (
          <motion.button
            key={i}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(i)}
            className={cn(
              "relative w-10 h-10 rounded-xl text-[11px] font-black transition-all border-2 flex items-center justify-center",
              // State: Active (Sedang dipilih)
              isActive
                ? "bg-[#0F2342] text-white border-[#0F2342] shadow-lg shadow-[#0F2342]/20 z-10"
                : // State: Answered (Sudah ada isinya)
                  isAnswered
                  ? "bg-[#F4F8FF] text-[#1D5FAD] border-[#1D5FAD] shadow-sm"
                  : // State: Default (Kosong)
                    "bg-white text-slate-300 border-[#E2EAF4] hover:border-[#1D5FAD] hover:text-[#1D5FAD]",
            )}
          >
            {/* Indikator titik kecil jika sudah terisi namun sedang tidak aktif */}
            {isAnswered && !isActive && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#1D5FAD] rounded-full" />
            )}

            {String(i + 1).padStart(2, "0")}
          </motion.button>
        );
      })}
    </div>
  );
}
