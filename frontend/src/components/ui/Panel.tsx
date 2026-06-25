import { ReactNode } from "react";

type PanelProps = {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  dense?: boolean;
};

export function Panel({
  title,
  eyebrow,
  action,
  children,
  className = "",
  dense = false,
}: PanelProps) {
  return (
    <section className={`panel ${dense ? "p-4" : "p-5"} ${className}`}>
      {(title || eyebrow || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="mb-1 text-[0.68rem] font-bold uppercase text-slate-500">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-base font-black uppercase text-slate-100">
                {title}
              </h2>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
