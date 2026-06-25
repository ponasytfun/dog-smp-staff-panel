import { Bot, CheckCircle2, Code2, KeyRound, LockKeyhole, ServerCog } from "lucide-react";
import { IntegrationStatus } from "../../data/mockData";
import { MockUser } from "../../lib/auth";
import { ROLE_IDS, roleDisplayNames } from "../../lib/permissions";
import { Badge } from "../ui/Badge";
import { Panel } from "../ui/Panel";
import { PixelButton } from "../ui/PixelButton";
import { RoleGate } from "../ui/RoleGate";
import { StatusDot } from "../ui/StatusDot";

type SettingsPageProps = {
  integrations: IntegrationStatus[];
  currentUser: MockUser;
};

export function SettingsPage({ integrations, currentUser }: SettingsPageProps) {
  return (
    <div className="grid gap-4">
      <Panel title="Integration Checklist" eyebrow="No secrets stored in frontend">
        <div className="grid gap-3 lg:grid-cols-3">
          <ChecklistItem icon={<LockKeyhole size={18} />} label="Discord OAuth" text="Client ID and redirect URI placeholders only." />
          <ChecklistItem icon={<Bot size={18} />} label="Bot/Webhooks" text="Webhook env name listed, real URL belongs server-side." />
          <ChecklistItem icon={<ServerCog size={18} />} label="Plugin API" text="Minecraft bridge URL prepared for future backend fetches." />
        </div>
      </Panel>

      <Panel
        title="API Status Cards"
        eyebrow="Environment placeholders"
        action={
          <RoleGate user={currentUser} permission="integrations.configure">
            <PixelButton variant="secondary" icon={<KeyRound size={14} />}>
              Configure
            </PixelButton>
          </RoleGate>
        }
      >
        <div className="grid gap-3 xl:grid-cols-2">
          {integrations.map((integration) => (
            <div key={integration.key} className="mini-panel">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <StatusDot status={integration.status} label={integration.label} />
                <Badge tone="muted">{integration.key}</Badge>
              </div>
              <p className="text-sm text-slate-400">{integration.description}</p>
              <div className="mt-4 grid gap-2">
                {integration.envVars.map((envVar) => (
                  <code key={envVar} className="env-pill">
                    {envVar}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Panel title="Discord Role IDs" eyebrow="Frontend permission map">
          <div className="grid gap-3">
            {(Object.keys(ROLE_IDS) as Array<keyof typeof ROLE_IDS>).map((role) => (
              <div key={role} className="flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-black/20 p-3">
                <span className="text-sm font-black uppercase text-slate-100">
                  {roleDisplayNames[role]}
                </span>
                <code className="text-xs text-slate-400">{ROLE_IDS[role]}</code>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Developer Diagnostics" eyebrow="Dev role only">
          <RoleGate
            user={currentUser}
            permission="integrations.debug"
            fallback={
              <div className="mini-panel text-sm text-slate-400">
                Switch to the Developer mock user to view integration/debug cards.
              </div>
            }
          >
            <div className="grid gap-3">
              <ChecklistItem icon={<Code2 size={18} />} label="Mock API source" text="All panel calls route through src/lib/api.ts." />
              <ChecklistItem icon={<CheckCircle2 size={18} />} label="Secret scan posture" text=".env and local secret files are ignored by git." />
              <ChecklistItem icon={<KeyRound size={18} />} label="Backend handoff" text="Replace mockDelay calls with real fetch wrappers later." />
            </div>
          </RoleGate>
        </Panel>
      </div>
    </div>
  );
}

function ChecklistItem({
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
      <div className="flex items-center gap-2 text-minecraft">
        {icon}
        <span className="text-xs font-black uppercase">{label}</span>
      </div>
      <p className="mt-2 text-sm text-slate-400">{text}</p>
    </div>
  );
}
