import { useMemo, useState } from "react";
import { FilePenLine, Search, ShieldAlert, UserRoundCheck } from "lucide-react";
import { Member } from "../../data/mockData";
import { MockUser } from "../../lib/auth";
import { formatRelativeTime } from "../../lib/format";
import { RoleBadge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { Panel } from "../ui/Panel";
import { PixelButton } from "../ui/PixelButton";
import { RoleGate } from "../ui/RoleGate";

type MembersPageProps = {
  members: Member[];
  currentUser: MockUser;
};

export function MembersPage({ members, currentUser }: MembersPageProps) {
  const [query, setQuery] = useState("");
  const [linkedOnly, setLinkedOnly] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return members.filter((member) => {
      const matchesQuery =
        !normalized ||
        member.minecraftUsername.toLowerCase().includes(normalized) ||
        member.discordUsername.toLowerCase().includes(normalized);
      return matchesQuery && (!linkedOnly || member.linked);
    });
  }, [linkedOnly, members, query]);

  return (
    <Panel
      title="Member Directory"
      eyebrow="Linked accounts"
      action={
        <label className="inline-flex items-center gap-2 text-xs font-bold uppercase text-slate-400">
          <input
            className="accent-emerald-400"
            type="checkbox"
            checked={linkedOnly}
            onChange={(event) => setLinkedOnly(event.target.checked)}
          />
          Linked only
        </label>
      }
    >
      <div className="mb-4 flex items-center gap-3 border border-white/10 bg-black/30 px-3 py-2">
        <Search size={16} className="text-slate-500" />
        <input
          className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
          placeholder="Search Minecraft or Discord user..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={28} />}
          title="No members found"
          message="Adjust the search or linked-account filter."
        />
      ) : (
        <div className="grid gap-3">
          {filtered.map((member) => (
            <div key={member.id} className="table-row-grid grid-cols-[1fr_9rem_8rem_11rem]">
              <div className="min-w-0">
                <p className="font-black uppercase text-slate-100">{member.minecraftUsername}</p>
                <p className="mt-1 text-sm text-slate-400">@{member.discordUsername}</p>
                <p className="mt-2 truncate text-xs text-slate-500">{member.notes}</p>
              </div>
              <div>
                <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase ${member.linked ? "text-minecraft" : "text-arena"}`}>
                  <UserRoundCheck size={15} />
                  {member.linked ? "Linked" : "Pending"}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                <span className="block">Warns: {member.warnings}</span>
                <span className="block">Pun: {member.punishments}</span>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <span className="text-xs text-slate-500">{formatRelativeTime(member.lastSeen)}</span>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {member.roles.length > 0
                    ? member.roles.map((role) => <RoleBadge key={role} role={role} />)
                    : <span className="text-xs text-slate-600">No staff role</span>}
                </div>
                <RoleGate user={currentUser} permission="members.full">
                  <div className="flex gap-2">
                    <PixelButton icon={<FilePenLine size={14} />}>Notes</PixelButton>
                    <PixelButton variant="danger" icon={<ShieldAlert size={14} />}>Action</PixelButton>
                  </div>
                </RoleGate>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
