import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  AnalyticsData,
  ArenaData,
  IntegrationStatus,
  Member,
  MinecraftServer,
  OverviewStats,
  Punishment,
  QuotaReport,
  StaffMember,
  Ticket,
} from "../data/mockData";
import {
  getAnalytics,
  getArena,
  getIntegrationStatus,
  getMembers,
  getOverviewStats,
  getPunishments,
  getQuotaReport,
  getServers,
  getStaff,
  getTickets,
} from "../lib/api";
import { DEFAULT_MOCK_USER_ID, getMockUser } from "../lib/auth";
import { RouteId, canAccessRoute } from "../lib/permissions";
import { routes } from "./routes";
import { Shell } from "../components/layout/Shell";
import { LoadingPanel } from "../components/ui/LoadingBlock";
import { EmptyState } from "../components/ui/EmptyState";
import { OverviewPage } from "../components/dashboard/OverviewPage";
import { AnalyticsPage } from "../components/dashboard/AnalyticsPage";
import { ServersPage } from "../components/dashboard/ServersPage";
import { ArenaPage } from "../components/dashboard/ArenaPage";
import { MembersPage } from "../components/dashboard/MembersPage";
import { StaffPage } from "../components/dashboard/StaffPage";
import { TicketsPage } from "../components/dashboard/TicketsPage";
import { PunishmentsPage } from "../components/dashboard/PunishmentsPage";
import { QuotasPage } from "../components/dashboard/QuotasPage";
import { SettingsPage } from "../components/dashboard/SettingsPage";

type DashboardData = {
  overview: OverviewStats;
  analytics: AnalyticsData;
  servers: MinecraftServer[];
  arena: ArenaData;
  members: Member[];
  staff: StaffMember[];
  tickets: Ticket[];
  punishments: Punishment[];
  quota: QuotaReport;
  integrations: IntegrationStatus[];
};

const routeIds = routes.map((route) => route.id);

function getInitialRoute(): RouteId {
  const hash = window.location.hash.replace("#", "") as RouteId;
  return routeIds.includes(hash) ? hash : "overview";
}

export function App() {
  const [activeRoute, setActiveRoute] = useState<RouteId>(getInitialRoute);
  const [userId, setUserId] = useState(DEFAULT_MOCK_USER_ID);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useMemo(() => getMockUser(userId), [userId]);

  useEffect(() => {
    let active = true;
    Promise.all([
      getOverviewStats(),
      getAnalytics("24h"),
      getServers(),
      getArena(),
      getMembers(),
      getStaff(),
      getTickets(),
      getPunishments(),
      getQuotaReport(),
      getIntegrationStatus(),
    ])
      .then(
        ([
          overview,
          analytics,
          servers,
          arena,
          members,
          staff,
          tickets,
          punishments,
          quota,
          integrations,
        ]) => {
          if (!active) {
            return;
          }

          setData({
            overview,
            analytics,
            servers,
            arena,
            members,
            staff,
            tickets,
            punishments,
            quota,
            integrations,
          });
        },
      )
      .catch((unknownError) => {
        if (active) {
          setError(
            unknownError instanceof Error
              ? unknownError.message
              : "Unknown mock API error",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!canAccessRoute(currentUser.role, activeRoute)) {
      setActiveRoute("overview");
      window.history.replaceState(null, "", "#overview");
    }
  }, [activeRoute, currentUser.role]);

  function changeRoute(routeId: RouteId) {
    setActiveRoute(routeId);
    window.history.replaceState(null, "", `#${routeId}`);
  }

  function renderRoute() {
    if (!data) {
      return <LoadingPanel />;
    }

    switch (activeRoute) {
      case "overview":
        return (
          <OverviewPage
            stats={data.overview}
            servers={data.servers}
            integrations={data.integrations}
            currentUser={currentUser}
          />
        );
      case "analytics":
        return (
          <AnalyticsPage
            initialAnalytics={data.analytics}
            currentUser={currentUser}
          />
        );
      case "servers":
        return (
          <ServersPage
            servers={data.servers}
            integrations={data.integrations}
            currentUser={currentUser}
          />
        );
      case "arena":
        return <ArenaPage arena={data.arena} currentUser={currentUser} />;
      case "members":
        return <MembersPage members={data.members} currentUser={currentUser} />;
      case "staff":
        return <StaffPage staff={data.staff} currentUser={currentUser} />;
      case "tickets":
        return <TicketsPage tickets={data.tickets} currentUser={currentUser} />;
      case "punishments":
        return (
          <PunishmentsPage
            punishments={data.punishments}
            currentUser={currentUser}
          />
        );
      case "quotas":
        return <QuotasPage quota={data.quota} currentUser={currentUser} />;
      case "settings":
        return (
          <SettingsPage
            integrations={data.integrations}
            currentUser={currentUser}
          />
        );
      default:
        return null;
    }
  }

  return (
    <Shell
      activeRoute={activeRoute}
      currentUser={currentUser}
      onRouteChange={changeRoute}
      onUserChange={setUserId}
    >
      {error ? (
        <EmptyState
          icon={<AlertTriangle size={28} />}
          title="Mock API failed"
          message={error}
        />
      ) : (
        renderRoute()
      )}
    </Shell>
  );
}
