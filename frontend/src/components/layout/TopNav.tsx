import { Lock } from "lucide-react";
import { MockUser, mockUsers } from "../../lib/auth";
import { canAccessRoute, roleDescriptions } from "../../lib/permissions";
import { primaryRoutes } from "../../app/routes";
import { RoleBadge } from "../ui/Badge";

type TopNavProps = {
  activeRoute: string;
  currentUser: MockUser;
  onRouteChange: (routeId: string) => void;
  onUserChange: (userId: string) => void;
};

export function TopNav({
  activeRoute,
  currentUser,
  onRouteChange,
  onUserChange,
}: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-obsidian/92 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 lg:px-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="brand-mark" aria-hidden="true">
            DS
          </div>
          <div>
            <p className="text-[0.68rem] font-bold uppercase text-minecraft">
              Dog SMP / Staff Panel
            </p>
            <h1 className="text-lg font-black uppercase text-slate-100">
              Minecraft + Discord Ops
            </h1>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2" aria-label="Primary navigation">
          {primaryRoutes.map((route) => {
            const Icon = route.icon;
            const canAccess = canAccessRoute(currentUser.role, route.id);
            const isActive = activeRoute === route.id;

            return (
              <button
                key={route.id}
                className={`nav-tab ${isActive ? "nav-tab-active" : ""}`}
                disabled={!canAccess}
                onClick={() => onRouteChange(route.id)}
                title={canAccess ? route.description : "Role does not permit this route"}
              >
                <Icon size={15} />
                <span>{route.label}</span>
                {!canAccess && <Lock size={13} />}
              </button>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <div className="user-chip">
            <span className="avatar">{currentUser.avatarInitials}</span>
            <span>
              <span className="block text-xs font-black uppercase text-slate-100">
                {currentUser.displayName}
              </span>
              <span className="block text-[0.68rem] text-slate-500">
                @{currentUser.discordUsername}
              </span>
            </span>
            <RoleBadge role={currentUser.role} />
          </div>

          <label className="sr-only" htmlFor="mock-user">
            Mock user selector
          </label>
          <select
            id="mock-user"
            className="select-field"
            value={currentUser.id}
            onChange={(event) => onUserChange(event.target.value)}
            title={roleDescriptions[currentUser.role]}
          >
            {mockUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.displayName} / {user.role}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
