import { Lock } from "lucide-react";
import { MockUser } from "../../lib/auth";
import { canAccessRoute, RouteId } from "../../lib/permissions";
import { secondaryRoutes } from "../../app/routes";

type SidebarProps = {
  activeRoute: RouteId;
  currentUser: MockUser;
  onRouteChange: (routeId: RouteId) => void;
};

export function Sidebar({ activeRoute, currentUser, onRouteChange }: SidebarProps) {
  return (
    <aside className="panel h-fit p-3 lg:sticky lg:top-28">
      <p className="px-2 pb-2 text-[0.68rem] font-bold uppercase text-slate-500">
        Staff Sections
      </p>
      <nav className="grid gap-1" aria-label="Secondary navigation">
        {secondaryRoutes.map((route) => {
          const Icon = route.icon;
          const canAccess = canAccessRoute(currentUser.role, route.id);
          return (
            <button
              key={route.id}
              className={`side-tab ${activeRoute === route.id ? "side-tab-active" : ""}`}
              disabled={!canAccess}
              onClick={() => onRouteChange(route.id)}
              title={canAccess ? route.description : "Role does not permit this route"}
            >
              <Icon size={16} />
              <span className="min-w-0 flex-1 text-left">{route.label}</span>
              {!canAccess && <Lock size={13} />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
