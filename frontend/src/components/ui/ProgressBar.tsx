import { formatPercent } from "../../lib/format";

type ProgressBarProps = {
  value: number;
  tone?: "green" | "blue" | "orange" | "red";
  label?: string;
};

const toneClass: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
  green: "from-minecraft to-emerald-300",
  blue: "from-discord to-cyan-300",
  orange: "from-arena to-yellow-200",
  red: "from-danger to-orange-300",
};

export function ProgressBar({ value, tone = "green", label }: ProgressBarProps) {
  const normalized = Math.max(0, Math.min(value, 125));
  return (
    <div>
      {(label || value >= 0) && (
        <div className="mb-2 flex justify-between text-xs font-bold uppercase text-slate-400">
          <span>{label}</span>
          <span>{formatPercent(value)}</span>
        </div>
      )}
      <div className="h-3 border border-white/10 bg-black/40 p-[2px]">
        <div
          className={`h-full bg-gradient-to-r ${toneClass[tone]}`}
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  );
}
