import { Crown, Settings2, ShieldCheck } from "lucide-react";
import { StaffMember } from "../../data/mockData";
import { MockUser } from "../../lib/auth";
import { RoleBadge } from "../ui/Badge";
import { Panel } from "../ui/Panel";
import { PixelButton } from "../ui/PixelButton";
import { ProgressBar } from "../ui/ProgressBar";
import { RoleGate } from "../ui/RoleGate";

type StaffPageProps = {
  staff: StaffMember[];
  currentUser: MockUser;
};

export function StaffPage({ staff, currentUser }: StaffPageProps) {
  return (
    <div className="grid gap-4">
      <Panel
        title="Staff Roster"
        eyebrow="Activity and permissions"
        action={
          <RoleGate user={currentUser} permission="staff.manage">
            <PixelButton variant="secondary" icon={<Settings2 size={14} />}>
              Manage Roles
            </PixelButton>
          </RoleGate>
        }
      >
        <div className="grid gap-3">
          {staff.map((member) => (
            <div key={member.id} className="table-row-grid grid-cols-[1fr_8rem_10rem_11rem]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-black uppercase text-slate-100">{member.displayName}</p>
                  <RoleBadge role={member.role} />
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  {member.minecraftUsername} / @{member.discordUsername}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {member.permissions.map((permission) => (
                    <span key={permission} className="border border-white/10 bg-white/[0.03] px-2 py-1 text-[0.68rem] text-slate-400">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-sm text-slate-300">
                <p className="font-black text-minecraft">{member.activityHours}h</p>
                <p className="text-xs text-slate-500">this week</p>
              </div>
              <div className="text-sm text-slate-300">
                <p>{member.ticketsHandled} tickets</p>
                <p>{member.moderationActions} mod actions</p>
              </div>
              <div>
                <ProgressBar value={member.quotaProgress} tone={member.quotaProgress >= 100 ? "green" : "orange"} label="Quota" />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Permission View" eyebrow="Role gate map">
          <div className="grid gap-3">
            <PermissionLine icon={<ShieldCheck size={16} />} label="Admin" text="Punishments, tickets, full analytics, members, and server moderation." />
            <PermissionLine icon={<Crown size={16} />} label="Manager" text="Full access, roles, quota reports, settings, and integration config." />
            <PermissionLine icon={<Settings2 size={16} />} label="Dev" text="Manager access plus debug and integration diagnostics." />
          </div>
        </Panel>
        <Panel title="Manager Controls" eyebrow="Locked below manager">
          <RoleGate
            user={currentUser}
            permission="staff.manage"
            fallback={
              <div className="mini-panel text-sm text-slate-400">
                Staff controls require manager/dev. Shocking restraint from a UI,
                honestly.
              </div>
            }
          >
            <div className="grid gap-3">
              <PixelButton variant="primary">Sync Discord Roles</PixelButton>
              <PixelButton variant="secondary">Export Staff Activity</PixelButton>
              <PixelButton>Review Permission Drift</PixelButton>
            </div>
          </RoleGate>
        </Panel>
      </div>
    </div>
  );
}

function PermissionLine({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  return (
    <div className="mini-panel">
      <div className="flex items-center gap-2 text-slate-200">
        <span className="text-arena">{icon}</span>
        <span className="text-xs font-black uppercase">{label}</span>
      </div>
      <p className="mt-2 text-sm text-slate-400">{text}</p>
    </div>
  );
}
