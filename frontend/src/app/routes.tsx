import {
  Activity,
  BarChart3,
  CircleGauge,
  Crown,
  Gavel,
  LucideIcon,
  MessageSquareText,
  Server,
  Settings,
  Shield,
  Swords,
  Users,
} from "lucide-react";
import { RouteId } from "../lib/permissions";

export type AppRoute = {
  id: RouteId;
  label: string;
  description: string;
  icon: LucideIcon;
  primary?: boolean;
};

export const routes: AppRoute[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Live Minecraft and Discord command center.",
    icon: CircleGauge,
    primary: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Playercount, Discord growth, and activity insight.",
    icon: BarChart3,
    primary: true,
  },
  {
    id: "servers",
    label: "Servers",
    description: "Minecraft shard status and plugin bridge health.",
    icon: Server,
    primary: true,
  },
  {
    id: "arena",
    label: "Arena",
    description: "PvP queue, matches, winners, and staff controls.",
    icon: Swords,
    primary: true,
  },
  {
    id: "members",
    label: "Members",
    description: "Linked accounts, warnings, notes, and actions.",
    icon: Users,
    primary: true,
  },
  {
    id: "staff",
    label: "Staff",
    description: "Staff roster, activity, permissions, and quota context.",
    icon: Shield,
  },
  {
    id: "tickets",
    label: "Tickets",
    description: "Discord ticket queues and claimed work.",
    icon: MessageSquareText,
  },
  {
    id: "punishments",
    label: "Punishments",
    description: "Warnings, mutes, kicks, bans, evidence, approvals.",
    icon: Gavel,
  },
  {
    id: "quotas",
    label: "Quotas",
    description: "Weekly quota progress and report placeholders.",
    icon: Activity,
  },
  {
    id: "settings",
    label: "Settings",
    description: "OAuth, bot, plugin API, role IDs, and integrations.",
    icon: Settings,
  },
];

export const primaryRoutes = routes.filter((route) => route.primary);
export const secondaryRoutes = routes.filter((route) => !route.primary);

export const managerRouteIcon = Crown;
