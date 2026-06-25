import { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  message: string;
  icon?: ReactNode;
};

export function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center border border-dashed border-white/15 bg-black/20 p-8 text-center">
      {icon && <div className="mb-3 text-slate-500">{icon}</div>}
      <h3 className="text-sm font-black uppercase text-slate-200">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-400">{message}</p>
    </div>
  );
}
