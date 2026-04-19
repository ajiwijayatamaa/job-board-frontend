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
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const isAnswered = answeredMap[i];

        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              "w-9 h-9 rounded-xl text-xs font-black transition-all border",
              isActive
                ? "bg-zinc-900 text-white border-zinc-900 shadow-md scale-105"
                : isAnswered
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400",
            )}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
