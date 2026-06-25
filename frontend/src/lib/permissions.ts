export const ROLE_IDS = {
  staff: "1519420621103038484",
  manager: "1519390483669979193",
  dev: "1519392596441436352",
  admin: "1519390739249762397",
} as const;

export type UserRole = keyof typeof ROLE_IDS;
export type RoleId = (typeof ROLE_IDS)[UserRole];

export type Permission =
  | "overview.view"
  | "analytics.summary"
  | "analytics.full"
  | "servers.view"
  | "servers.moderate"
  | "arena.view"
  | "arena.manage"
  | "members.basic"
  | "members.full"
  | "tickets.assigned"
  | "tickets.manage"
  | "punishments.manage"
  | "punishments.audit"
  | "quota.self"
  | "quota.reports"
  | "quota.configure"
  | "staff.view"
  | "staff.manage"
  | "roles.manage"
  | "settings.view"
  | "integrations.configure"
  | "integrations.debug";

export type RouteId =
  | "overview"
  | "analytics"
  | "servers"
  | "arena"
  | "members"
  | "staff"
  | "tickets"
  | "punishments"
  | "quotas"
  | "settings";

const rolePermissions: Record<UserRole, Permission[]> = {
  staff: [
    "overview.view",
    "analytics.summary",
    "servers.view",
    "arena.view",
    "members.basic",
    "tickets.assigned",
    "quota.self",
  ],
  admin: [
    "overview.view",
    "analytics.summary",
    "analytics.full",
    "servers.view",
    "servers.moderate",
    "arena.view",
    "arena.manage",
    "members.basic",
    "members.full",
    "tickets.assigned",
    "tickets.manage",
    "punishments.manage",
    "quota.self",
    "quota.reports",
    "staff.view",
  ],
  manager: [
    "overview.view",
    "analytics.summary",
    "analytics.full",
    "servers.view",
    "servers.moderate",
    "arena.view",
    "arena.manage",
    "members.basic",
    "members.full",
    "tickets.assigned",
    "tickets.manage",
    "punishments.manage",
    "punishments.audit",
    "quota.self",
    "quota.reports",
    "quota.configure",
    "staff.view",
    "staff.manage",
    "roles.manage",
    "settings.view",
    "integrations.configure",
  ],
  dev: [
    "overview.view",
    "analytics.summary",
    "analytics.full",
    "servers.view",
    "servers.moderate",
    "arena.view",
    "arena.manage",
    "members.basic",
    "members.full",
    "tickets.assigned",
    "tickets.manage",
    "punishments.manage",
    "punishments.audit",
    "quota.self",
    "quota.reports",
    "quota.configure",
    "staff.view",
    "staff.manage",
    "roles.manage",
    "settings.view",
    "integrations.configure",
    "integrations.debug",
  ],
};

const routePermissions: Record<RouteId, Permission> = {
  overview: "overview.view",
  analytics: "analytics.summary",
  servers: "servers.view",
  arena: "arena.view",
  members: "members.basic",
  staff: "staff.view",
  tickets: "tickets.assigned",
  punishments: "punishments.manage",
  quotas: "quota.self",
  settings: "settings.view",
};

export const roleDisplayNames: Record<UserRole, string> = {
  staff: "Staff",
  admin: "Admin",
  manager: "Manager",
  dev: "Developer",
};

export const roleDescriptions: Record<UserRole, string> = {
  staff: "Basic staff visibility with assigned work queues.",
  admin: "Moderation tooling, full analytics, and member actions.",
  manager: "Full staff, role, settings, and integration access.",
  dev: "Manager access plus integration and debug cards.",
};

export const roleAccentClass: Record<UserRole, string> = {
  staff: "text-minecraft border-minecraft/50 bg-minecraft/10",
  admin: "text-discord border-discord/50 bg-discord/10",
  manager: "text-arena border-arena/60 bg-arena/10",
  dev: "text-fuchsia-300 border-fuchsia-400/60 bg-fuchsia-400/10",
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function canAccessRoute(role: UserRole, routeId: RouteId): boolean {
  return hasPermission(role, routePermissions[routeId]);
}

export function getRoutePermission(routeId: RouteId): Permission {
  return routePermissions[routeId];
}

export function isManagerLike(role: UserRole): boolean {
  return role === "manager" || role === "dev";
}
