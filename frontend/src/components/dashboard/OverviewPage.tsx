import {
  Activity,
  Bot,
  Gauge,
  RadioTower,
  ServerCog,
  Users,
} from "lucide-react";
import { IntegrationStatus, MinecraftServer, OverviewStats } from "../../data/mockData";
import { MockUser } from "../../lib/auth";
import { formatNumber } from "../../lib/format";
import { hasPermission } from "../../lib/permissions";
import { LineChart } from "../../charts/LineChart";
import { Badge } from "../ui/Badge";
import { Panel } from "../ui/Panel";
import { PixelButton } from "../ui/PixelButton";
import { ProgressBar } from "../ui/ProgressBar";
import { RoleGate } from "../ui/RoleGate";
import { StatCard } from "../ui/StatCard";
import { StatusDot } from "../ui/StatusDot";

type OverviewPageProps = {
  stats: OverviewStats;
  servers: MinecraftServer[];
  integrations: IntegrationStatus[];
  currentUser: MockUser;
};

export function OverviewPage({
  stats,
  servers,
  integrations,
  currentUser,
}: OverviewPageProps) {
  const onlineServers = servers.filter((server) => server.status === "online").length;
  const connectedIntegrations = integrations.filter((item) => item.status === "online").length;

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Live Players"
          value={`${stats.playersOnline}/${stats.playersMax}`}
          accent="green"
          meta={`+${stats.weeklyMinecraftGrowth}% Minecraft growth this week`}
          icon={<Gauge size={20} />}
        />
        <StatCard
          label="Discord Online"
          value={formatNumber(stats.discordOnline)}
          accent="blue"
          meta={`${formatNumber(stats.discordMembers)} total members`}
          icon={<Users size={20} />}
        />
        <StatCard
          label="Network Rank"
          value={`#${stats.networkRank}`}
          accent="orange"
          meta={`Top ${stats.networkTotal} tracked SMP networks`}
          icon={<Activity size={20} />}
        />
        <StatCard
          label="Uptime"
          value={`${stats.uptimePercent}%`}
          accent="green"
          meta={`${onlineServers}/${servers.length} Minecraft servers online`}
          icon={<RadioTower size={20} />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
        <Panel
          title="Live Activity"
          eyebrow="Minecraft vs Discord"
          action={
            <RoleGate user={currentUser} permission="servers.moderate">
              <PixelButton variant="primary" icon={<ServerCog size={15} />}>
                Manage Server
              </PixelButton>
            </RoleGate>
          }
        >
          <LineChart
            height={300}
            series={[
              {
                label: "Minecraft players",
                color: "#64ff72",
                values: stats.activity.map((point) => ({
                  label: point.label,
                  value: point.minecraftPlayers,
                })),
              },
              {
                label: "Discord online",
                color: "#7a9cff",
                values: stats.activity.map((point) => ({
                  label: point.label,
                  value: point.discordOnline,
                })),
              },
            ]}
          />
        </Panel>

        <Panel title="Server Identity" eyebrow="Dog SMP">
          <div className="space-y-4">
            <div className="identity-card">
              <div>
                <p className="text-[0.68rem] font-bold uppercase text-slate-500">
                  Public Name
                </p>
                <h3 className="mt-1 text-3xl font-black uppercase text-slate-100">
                  {stats.serverName}
                </h3>
              </div>
              <Badge tone="orange">Season 4</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="mini-panel">
                <StatusDot status={stats.minecraftStatus} label="Minecraft live" />
                <p className="mt-2 text-sm text-slate-400">
                  Plugin status placeholder ready for `/discordlinktrackerdebug`.
                </p>
              </div>
              <div className="mini-panel">
                <StatusDot status={stats.discordStatus} label="Discord live" />
                <p className="mt-2 text-sm text-slate-400">
                  OAuth and bot sync are mocked until backend wiring exists.
                </p>
              </div>
            </div>

            <ProgressBar
              label={`Peak record ${stats.peakRecord}/${stats.peakTarget}`}
              value={(stats.peakRecord / stats.peakTarget) * 100}
              tone="orange"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="mini-panel">
                <p className="text-[0.68rem] font-bold uppercase text-slate-500">
                  Average / Day
                </p>
                <p className="mt-1 text-2xl font-black text-minecraft">
                  {stats.averagePlayersPerDay}
                </p>
              </div>
              <div className="mini-panel">
                <p className="text-[0.68rem] font-bold uppercase text-slate-500">
                  Integrations Live
                </p>
                <p className="mt-1 text-2xl font-black text-discord">
                  {connectedIntegrations}/{integrations.length}
                </p>
              </div>
            </div>

            {!hasPermission(currentUser.role, "servers.moderate") && (
              <p className="border border-arena/30 bg-arena/10 p-3 text-xs text-arena">
                Staff can view status, but server management is locked to admin+.
              </p>
            )}
          </div>
        </Panel>
      </div>

      <Panel title="Integration Snapshot" eyebrow="Future backend bridge">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {integrations.map((item) => (
            <div key={item.key} className="mini-panel">
              <div className="flex items-center justify-between gap-2">
                <StatusDot status={item.status} label={item.label} />
                <Bot size={16} className="text-slate-500" />
              </div>
              <p className="mt-3 text-xs text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
