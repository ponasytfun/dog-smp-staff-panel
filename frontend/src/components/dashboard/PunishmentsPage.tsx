import { Eye, FileWarning, Gavel, ShieldAlert } from "lucide-react";
import { Punishment } from "../../data/mockData";
import { MockUser } from "../../lib/auth";
import { formatRelativeTime } from "../../lib/format";
import { hasPermission } from "../../lib/permissions";
import { Badge } from "../ui/Badge";
import { Panel } from "../ui/Panel";
import { PixelButton } from "../ui/PixelButton";
import { RoleGate } from "../ui/RoleGate";

type PunishmentsPageProps = {
  punishments: Punishment[];
  currentUser: MockUser;
};

const punishmentTone = {
  warning: "orange",
  mute: "blue",
  kick: "red",
  ban: "red",
} as const;

export function PunishmentsPage({
  punishments,
  currentUser,
}: PunishmentsPageProps) {
  const counts = {
    warnings: punishments.filter((item) => item.type === "warning").length,
    mutes: punishments.filter((item) => item.type === "mute").length,
    kicks: punishments.filter((item) => item.type === "kick").length,
    bans: punishments.filter((item) => item.type === "ban").length,
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-4">
        {Object.entries(counts).map(([label, value]) => (
          <div key={label} className="panel p-4">
            <p className="text-[0.68rem] font-bold uppercase text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-arena">{value}</p>
          </div>
        ))}
      </div>

      <Panel
        title="Punishment History"
        eyebrow="Moderation records"
        action={
          <RoleGate user={currentUser} permission="punishments.manage">
            <PixelButton variant="danger" icon={<Gavel size={14} />}>
              New Action
            </PixelButton>
          </RoleGate>
        }
      >
        <div className="grid gap-3">
          {punishments.map((punishment) => (
            <div key={punishment.id} className="table-row-grid grid-cols-[7rem_1fr_8rem_12rem]">
              <div>
                <p className="font-black uppercase text-slate-100">{punishment.id}</p>
                <Badge tone={punishmentTone[punishment.type]}>{punishment.type}</Badge>
              </div>
              <div>
                <p className="font-black uppercase text-slate-100">{punishment.player}</p>
                <p className="mt-1 text-sm text-slate-400">{punishment.reason}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Issued by {punishment.issuedBy} / {formatRelativeTime(punishment.issuedAt)}
                </p>
              </div>
              <div>
                <Badge tone={punishment.approval === "approved" ? "green" : punishment.approval === "rejected" ? "red" : "orange"}>
                  {punishment.approval}
                </Badge>
                <p className="mt-2 text-xs text-slate-500">Evidence: {punishment.evidence}</p>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <Badge tone={punishment.severity === "high" ? "red" : punishment.severity === "medium" ? "orange" : "muted"}>
                  {punishment.severity}
                </Badge>
                <RoleGate user={currentUser} permission="punishments.manage">
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <PixelButton icon={<FileWarning size={14} />}>Evidence</PixelButton>
                    <PixelButton variant="secondary" icon={<ShieldAlert size={14} />}>Review</PixelButton>
                  </div>
                </RoleGate>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {hasPermission(currentUser.role, "punishments.audit") && (
        <Panel title="Manager Audit View" eyebrow="High trust queue">
          <div className="mini-panel">
            <div className="flex items-center gap-2 text-discord">
              <Eye size={17} />
              <span className="text-xs font-black uppercase">Audit trail placeholder</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Future backend can stream approval transitions, evidence attachment
              history, Discord embed IDs, and staff action diffs here.
            </p>
          </div>
        </Panel>
      )}
    </div>
  );
}
