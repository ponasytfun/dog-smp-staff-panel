import { Flame, Swords, Trophy, UsersRound } from "lucide-react";
import { ArenaData } from "../../data/mockData";
import { MockUser } from "../../lib/auth";
import { formatRelativeTime } from "../../lib/format";
import { Badge } from "../ui/Badge";
import { Panel } from "../ui/Panel";
import { PixelButton } from "../ui/PixelButton";
import { RoleGate } from "../ui/RoleGate";
import { StatCard } from "../ui/StatCard";
import { StatusDot } from "../ui/StatusDot";

type ArenaPageProps = {
  arena: ArenaData;
  currentUser: MockUser;
};

export function ArenaPage({ arena, currentUser }: ArenaPageProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Arena Status" value={arena.status} accent="orange" icon={<Swords size={20} />} />
        <StatCard label="Queue" value={arena.queueCount} accent="blue" meta="Players waiting" icon={<UsersRound size={20} />} />
        <StatCard label="Active Fighters" value={arena.activePlayers} accent="green" icon={<Flame size={20} />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_20rem]">
        <Panel
          title="Active Matches"
          eyebrow="PvP monitor"
          action={
            <RoleGate user={currentUser} permission="arena.manage">
              <div className="flex flex-wrap gap-2">
                <PixelButton variant="primary">Pause Queue</PixelButton>
                <PixelButton variant="secondary">Force Sync</PixelButton>
              </div>
            </RoleGate>
          }
        >
          <div className="grid gap-3">
            {arena.matches.map((match) => (
              <div key={match.id} className="table-row-grid grid-cols-[7rem_1fr_7rem]">
                <div>
                  <Badge tone={match.status === "live" ? "green" : match.status === "queued" ? "blue" : "muted"}>
                    {match.status}
                  </Badge>
                  <p className="mt-2 text-[0.68rem] text-slate-500">{match.id}</p>
                </div>
                <div>
                  <p className="font-black uppercase text-slate-100">{match.mode}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {match.map} / {match.players.join(" vs ")}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  {match.status === "queued" ? "Starts soon" : formatRelativeTime(match.startedAt)}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent Winners" eyebrow="Arena highlights">
          <div className="space-y-3">
            {arena.recentWinners.map((winner) => (
              <div key={`${winner.player}-${winner.mode}`} className="mini-panel">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase text-slate-100">
                      {winner.player}
                    </p>
                    <p className="text-xs text-slate-500">{winner.mode}</p>
                  </div>
                  <Trophy size={18} className="text-arena" />
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  {winner.streak} streak / {winner.at}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Plugin-Tracked Arena Stats" eyebrow="Placeholder">
        <div className="mini-panel">
          <StatusDot status="syncing" label="Future event feed" />
          <p className="mt-3 text-sm text-slate-400">
            This area is prepared for match starts, kit stats, winner embeds, queue
            snapshots, and referee actions once the Minecraft plugin exposes arena
            events.
          </p>
        </div>
      </Panel>
    </div>
  );
}
