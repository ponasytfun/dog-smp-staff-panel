import { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { MockUser } from "../../lib/auth";
import { RouteId, canAccessRoute } from "../../lib/permissions";
import { routes } from "../../app/routes";
import { EmptyState } from "../ui/EmptyState";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

type ShellProps = {
  activeRoute: RouteId;
  currentUser: MockUser;
  onRouteChange: (routeId: RouteId) => void;
  onUserChange: (userId: string) => void;
  children: ReactNode;
};

export function Shell({
  activeRoute,
  currentUser,
  onRouteChange,
  onUserChange,
  children,
}: ShellProps) {
  const route = routes.find((item) => item.id === activeRoute) ?? routes[0];
  const canAccess = canAccessRoute(currentUser.role, activeRoute);

  return (
    <div className="min-h-screen">
      <TopNav
        activeRoute={activeRoute}
        currentUser={currentUser}
        onRouteChange={(routeId) => onRouteChange(routeId as RouteId)}
        onUserChange={onUserChange}
      />
      <main className="mx-auto grid max-w-[1600px] gap-5 px-4 py-5 lg:grid-cols-[15rem_1fr] lg:px-6">
        <Sidebar
          activeRoute={activeRoute}
          currentUser={currentUser}
          onRouteChange={onRouteChange}
        />
        <div className="min-w-0">
          <div className="mb-5 flex flex-col justify-between gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end">
            <div>
              <p className="text-[0.68rem] font-bold uppercase text-slate-500">
                {route.primary ? "Primary Console" : "Secondary Console"}
              </p>
              <h2 className="text-2xl font-black uppercase text-slate-100 md:text-3xl">
                {route.label}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-400">
                {route.description}
              </p>
            </div>
            <div className="text-xs font-bold uppercase text-slate-500">
              Mock auth / no backend connected
            </div>
          </div>
          {canAccess ? (
            children
          ) : (
            <EmptyState
              icon={<AlertTriangle size={28} />}
              title="Route locked"
              message="This mock role cannot access the selected section. Switch the mock user to test manager/admin gates."
            />
          )}
        </div>
      </main>
    </div>
  );
}
