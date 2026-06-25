import { KeyRound, PlugZap, ShieldCheck, TerminalSquare } from "lucide-react";
import { IntegrationStatus, MinecraftServer } from "../../data/mockData";
import { MockUser } from "../../lib/auth";
import { formatRelativeTime } from "../../lib/format";
import { Badge } from "../ui/Badge";
import { Panel } from "../ui/Panel";
import { PixelButton } from "../ui/PixelButton";
import { ProgressBar } from "../ui/ProgressBar";
import { RoleGate } from "../ui/RoleGate";
import { StatusDot } from "../ui/StatusDot";

type ServersPageProps = {
  servers: MinecraftServer[];
  integrations: IntegrationStatus[];
  currentUser: MockUser;
};

export function ServersPage({ servers, integrations, currentUser }: ServersPageProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 xl:grid-cols-3">
        {servers.map((server) => (
          <Panel key={server.id} title={server.name} eyebrow={server.address}>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <StatusDot status={server.status} />
                <Badge tone={server.status === "online" ? "green" : server.status === "degraded" ? "orange" : "red"}>
                  {server.version}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Latency" value={server.latencyMs ? `${server.latencyMs}ms` : "n/a"} />
                <Metric label="Players" value={`${server.playersOnline}/${server.playersMax}`} />
                <Metric label="Record" value={server.recordPlayers} />
                <Metric label="Plugin" value={server.pluginConnection} />
              </div>
              <ProgressBar label="Uptime" value={server.uptimePercent} tone="green" />
              <div className="mini-panel">
                <div className="flex items-center justify-between gap-2">
                  <StatusDot status={server.pluginConnection} label="Plugin bridge" />
                  <PlugZap size={16} className="text-slate-500" />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Last mock ping: {formatRelativeTime(server.lastPluginPing)}
                </p>
              </div>
              <RoleGate user={currentUser} permission="servers.moderate">
                <div className="flex flex-wrap gap-2">
                  <PixelButton variant="secondary" icon={<TerminalSquare size={14} />}>
                    Open Tools
                  </PixelButton>
                  <PixelButton variant="ghost" icon={<ShieldCheck size={14} />}>
                    Moderation
                  </PixelButton>
                </div>
              </RoleGate>
            </div>
          </Panel>
        ))}
      </div>

      <Panel title="Plugin API Placeholder" eyebrow="Future connection">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="mini-panel">
            <div className="mb-3 flex items-center gap-2 text-arena">
              <KeyRound size={17} />
              <span className="text-xs font-black uppercase">Webhook/API key</span>
            </div>
            <p className="text-sm text-slate-400">
              Store real keys server-side later. This frontend only displays environment
              variable names and mock connection state.
            </p>
            <div className="mt-4 grid gap-2">
              {integrations
                .filter((item) => item.key !== "role-map")
                .map((item) => (
                  <div key={item.key} className="flex items-center justify-between border border-white/10 bg-black/20 p-3">
                    <StatusDot status={item.status} label={item.label} />
                    <Badge tone="muted">{item.envVars.length} env</Badge>
                  </div>
                ))}
            </div>
          </div>
          <div className="mini-panel">
            <p className="text-xs font-black uppercase text-slate-400">
              Future plugin data targets
            </p>
            <ul className="mt-3 grid gap-2 text-sm text-slate-300">
              <li>Linked account status and pending link confirmations</li>
              <li>Playtime sessions, prune reports, and linked leaderboard</li>
              <li>Inventory snapshot audit trails</li>
              <li>Server health, arena events, and moderation actions</li>
            </ul>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="mini-panel">
      <p className="text-[0.68rem] font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black uppercase text-slate-100">{value}</p>
    </div>
  );
}
