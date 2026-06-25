import { useEffect, useMemo, useState } from "react";
import { Archive, CheckCheck, Hand, Inbox } from "lucide-react";
import { Ticket } from "../../data/mockData";
import { MockUser } from "../../lib/auth";
import { formatRelativeTime } from "../../lib/format";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { Panel } from "../ui/Panel";
import { PixelButton } from "../ui/PixelButton";
import { RoleGate } from "../ui/RoleGate";

type TicketsPageProps = {
  tickets: Ticket[];
  currentUser: MockUser;
};

const priorityTone = {
  low: "muted",
  medium: "blue",
  high: "orange",
  urgent: "red",
} as const;

export function TicketsPage({ tickets, currentUser }: TicketsPageProps) {
  const [localTickets, setLocalTickets] = useState(tickets);
  const [filter, setFilter] = useState<"all" | "open" | "mine" | "closed">("all");

  useEffect(() => {
    setLocalTickets(tickets);
  }, [tickets]);

  const visibleTickets = useMemo(() => {
    return localTickets.filter((ticket) => {
      if (filter === "open") {
        return ticket.status === "open" || ticket.status === "waiting";
      }
      if (filter === "mine") {
        return ticket.claimedBy === currentUser.displayName;
      }
      if (filter === "closed") {
        return ticket.status === "closed";
      }
      return true;
    });
  }, [currentUser.displayName, filter, localTickets]);

  function claimTicket(ticketId: string) {
    setLocalTickets((items) =>
      items.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, status: "claimed", claimedBy: currentUser.displayName }
          : ticket,
      ),
    );
  }

  function closeTicket(ticketId: string) {
    setLocalTickets((items) =>
      items.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: "closed" } : ticket,
      ),
    );
  }

  return (
    <div className="grid gap-4">
      <Panel
        title="Ticket Queue"
        eyebrow="Discord integration placeholder"
        action={
          <div className="flex flex-wrap gap-2">
            {(["all", "open", "mine", "closed"] as const).map((item) => (
              <PixelButton
                key={item}
                variant={filter === item ? "secondary" : "ghost"}
                onClick={() => setFilter(item)}
              >
                {item}
              </PixelButton>
            ))}
          </div>
        }
      >
        {visibleTickets.length === 0 ? (
          <EmptyState
            icon={<Inbox size={28} />}
            title="No tickets"
            message="The selected queue is empty."
          />
        ) : (
          <div className="grid gap-3">
            {visibleTickets.map((ticket) => (
              <div key={ticket.id} className="table-row-grid grid-cols-[7rem_1fr_9rem_14rem]">
                <div>
                  <p className="font-black uppercase text-slate-100">{ticket.id}</p>
                  <Badge tone={priorityTone[ticket.priority]}>{ticket.priority}</Badge>
                </div>
                <div className="min-w-0">
                  <p className="font-black uppercase text-slate-100">{ticket.title}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {ticket.type} / requested by {ticket.requester}
                  </p>
                </div>
                <div>
                  <Badge tone={ticket.status === "open" ? "green" : ticket.status === "closed" ? "muted" : "blue"}>
                    {ticket.status}
                  </Badge>
                  <p className="mt-2 text-xs text-slate-500">
                    {ticket.claimedBy ? `By ${ticket.claimedBy}` : "Unclaimed"}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <span className="text-xs text-slate-500">
                    {formatRelativeTime(ticket.lastActivity)}
                  </span>
                  <RoleGate user={currentUser} permission={ticket.claimedBy === currentUser.displayName ? "tickets.assigned" : "tickets.manage"}>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <PixelButton
                        icon={<Hand size={14} />}
                        disabled={ticket.status === "closed"}
                        onClick={() => claimTicket(ticket.id)}
                      >
                        Claim
                      </PixelButton>
                      <PixelButton
                        variant="danger"
                        icon={<Archive size={14} />}
                        disabled={ticket.status === "closed"}
                        onClick={() => closeTicket(ticket.id)}
                      >
                        Close
                      </PixelButton>
                    </div>
                  </RoleGate>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Future Discord Ticket Bridge" eyebrow="Read-only mock">
        <div className="mini-panel">
          <div className="flex items-center gap-2 text-minecraft">
            <CheckCheck size={17} />
            <span className="text-xs font-black uppercase">Ready shape</span>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Claim and close buttons mutate local mock state only. Later these can
            call Discord bot endpoints without changing the page contract.
          </p>
        </div>
      </Panel>
    </div>
  );
}
