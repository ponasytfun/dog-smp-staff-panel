import { HTMLAttributes } from "react";
import { UserRole, roleAccentClass, roleDisplayNames } from "../../lib/permissions";

type Tone = "green" | "blue" | "orange" | "red" | "purple" | "muted";

const toneClass: Record<Tone, string> = {
  green: "border-minecraft/50 bg-minecraft/10 text-minecraft",
  blue: "border-discord/50 bg-discord/10 text-discord",
  orange: "border-arena/60 bg-arena/10 text-arena",
  red: "border-danger/60 bg-danger/10 text-danger",
  purple: "border-fuchsia-400/60 bg-fuchsia-400/10 text-fuchsia-300",
  muted: "border-white/15 bg-white/5 text-slate-300",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
};

export function Badge({ className = "", tone = "muted", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 border px-2 py-1 text-[0.68rem] font-bold uppercase tracking-normal ${toneClass[tone]} ${className}`}
      {...props}
    />
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge className={roleAccentClass[role]}>
      {roleDisplayNames[role]}
    </Badge>
  );
}
