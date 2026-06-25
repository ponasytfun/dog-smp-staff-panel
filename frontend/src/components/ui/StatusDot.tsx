import { Status } from "../../data/mockData";

const statusClass: Record<Status, string> = {
  online: "bg-minecraft shadow-[0_0_12px_rgba(100,255,114,0.8)]",
  offline: "bg-danger shadow-[0_0_12px_rgba(255,95,115,0.55)]",
  degraded: "bg-arena shadow-[0_0_12px_rgba(255,184,77,0.65)]",
  syncing: "bg-discord shadow-[0_0_12px_rgba(122,156,255,0.65)]",
};

export function StatusDot({
  status,
  label,
}: {
  status: Status;
  label?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase text-slate-300">
      <span className={`h-2.5 w-2.5 ${statusClass[status]}`} aria-hidden="true" />
      {label ?? status}
    </span>
  );
}
