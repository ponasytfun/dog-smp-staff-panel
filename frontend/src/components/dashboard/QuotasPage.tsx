import { Settings2, Trophy } from "lucide-react";
import { QuotaReport } from "../../data/mockData";
import { MockUser } from "../../lib/auth";
import { hasPermission } from "../../lib/permissions";
import { RoleBadge } from "../ui/Badge";
import { Panel } from "../ui/Panel";
import { PixelButton } from "../ui/PixelButton";
import { ProgressBar } from "../ui/ProgressBar";
import { RoleGate } from "../ui/RoleGate";

type QuotasPageProps = {
  quota: QuotaReport;
  currentUser: MockUser;
};

export function QuotasPage({ quota, currentUser }: QuotasPageProps) {
  const canViewReports = hasPermission(currentUser.role, "quota.reports");
  const visibleRows = canViewReports
    ? quota.staff
    : quota.staff.filter((member) => member.name === currentUser.displayName);

  return (
    <div className="grid gap-4">
      <Panel
        title={`Quota Report / ${quota.weekLabel}`}
        eyebrow={canViewReports ? "All staff" : "Own quota only"}
        action={
          <RoleGate user={currentUser} permission="quota.configure">
            <PixelButton variant="secondary" icon={<Settings2 size={14} />}>
              Configure
            </PixelButton>
          </RoleGate>
        }
      >
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <Requirement label="Messages" value={quota.requirements.messages} />
          <Requirement label="Tickets" value={quota.requirements.tickets} />
          <Requirement label="Mod Actions" value={quota.requirements.moderationActions} />
          <Requirement label="Hours" value={quota.requirements.activityHours} />
        </div>

        <div className="grid gap-3">
          {visibleRows.map((member) => (
            <div key={member.staffId} className="table-row-grid grid-cols-[1fr_8rem_12rem_12rem]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-black uppercase text-slate-100">{member.name}</p>
                  <RoleBadge role={member.role} />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Rank-based requirements placeholder
                </p>
              </div>
              <div className="text-sm text-slate-300">
                <p>{member.messages} msgs</p>
                <p>{member.activityHours}h</p>
              </div>
              <div className="text-sm text-slate-300">
                <p>{member.tickets} tickets</p>
                <p>{member.moderationActions} mod actions</p>
              </div>
              <ProgressBar value={member.progress} tone={member.progress >= 100 ? "green" : "orange"} label="Progress" />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Weekly Report Card" eyebrow="Mock summary">
        <div className="mini-panel">
          <div className="flex items-center gap-2 text-arena">
            <Trophy size={17} />
            <span className="text-xs font-black uppercase">Top performer</span>
          </div>
          <p className="mt-3 text-sm text-slate-300">
            Byte is currently leading quota at 118%. Manager/dev controls can later
            adjust requirements by role and export weekly summaries.
          </p>
        </div>
      </Panel>
    </div>
  );
}

function Requirement({ label, value }: { label: string; value: number }) {
  return (
    <div className="mini-panel">
      <p className="text-[0.68rem] font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-100">{value}</p>
    </div>
  );
}
