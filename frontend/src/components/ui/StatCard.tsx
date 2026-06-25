import { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  accent?: "green" | "blue" | "orange" | "red";
  meta?: string;
  icon?: ReactNode;
};

const accentClass = {
  green: "text-minecraft shadow-glowGreen",
  blue: "text-discord shadow-glowBlue",
  orange: "text-arena shadow-[0_0_24px_rgba(255,184,77,0.18)]",
  red: "text-danger shadow-[0_0_24px_rgba(255,95,115,0.16)]",
};

export function StatCard({
  label,
  value,
  accent = "green",
  meta,
  icon,
}: StatCardProps) {
  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-bold uppercase text-slate-500">
            {label}
          </p>
          <p className={`mt-2 text-3xl font-black ${accentClass[accent]}`}>
            {value}
          </p>
        </div>
        {icon && (
          <div className="border border-white/10 bg-black/30 p-2 text-slate-400">
            {icon}
          </div>
        )}
      </div>
      {meta && <p className="mt-3 text-xs text-slate-400">{meta}</p>}
    </div>
  );
}
