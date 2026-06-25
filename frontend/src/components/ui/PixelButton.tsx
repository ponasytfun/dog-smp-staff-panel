import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variantClass: Record<Variant, string> = {
  primary:
    "border-minecraft/70 bg-minecraft/15 text-minecraft shadow-glowGreen hover:bg-minecraft/25",
  secondary:
    "border-discord/60 bg-discord/10 text-discord shadow-glowBlue hover:bg-discord/20",
  danger:
    "border-danger/60 bg-danger/10 text-danger hover:bg-danger/20",
  ghost: "border-white/15 bg-white/[0.03] text-slate-300 hover:bg-white/10",
};

type PixelButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: Variant;
};

export function PixelButton({
  children,
  className = "",
  icon,
  variant = "ghost",
  ...props
}: PixelButtonProps) {
  return (
    <button
      className={`pixel-button inline-flex items-center justify-center gap-2 border px-3 py-2 text-xs font-black uppercase tracking-normal transition ${variantClass[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
