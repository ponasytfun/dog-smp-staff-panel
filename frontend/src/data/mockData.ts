import { ROLE_IDS, UserRole } from "../lib/permissions";

export type Status = "online" | "offline" | "degraded" | "syncing";
export type AnalyticsRange = "live" | "1h" | "24h" | "30d" | "max" | "last-week";

export type TimePoint = {
  label: string;
  minecraftPlayers: number;
  discordOnline: number;
};

export type OverviewStats = {
  serverName: string;
  networkRank: number;
  networkTotal: number;
  minecraftStatus: Status;
  discordStatus: Status;
  playersOnline: number;
  playersMax: number;
  peakRecord: number;
  peakTarget: number;
  discordOnline: number;
  discordMembers: number;
  weeklyMinecraftGrowth: number;
  weeklyDiscordGrowth: number;
  uptimePercent: number;
  averagePlayersPerDay: number;
  activity: TimePoint[];
};

export type AnalyticsData = {
  range: AnalyticsRange;
  playerCount: TimePoint[];
  discordMembers: { label: string; value: number }[];
  hourlyHeatmap: { day: string; values: number[] }[];
  dayBars: { label: string; players: number; discord: number }[];
  insights: string[];
};

export type MinecraftServer = {
  id: string;
  name: string;
  address: string;
  status: Status;
  version: string;
  latencyMs: number;
  uptimePercent: number;
  playersOnline: number;
  playersMax: number;
  recordPlayers: number;
  pluginConnection: Status;
  lastPluginPing: string;
};

export type ArenaMatch = {
  id: string;
  mode: string;
  map: string;
  status: "live" | "queued" | "finished";
  players: string[];
  startedAt: string;
};

export type ArenaData = {
  status: Status;
  queueCount: number;
  activePlayers: number;
  matches: ArenaMatch[];
  recentWinners: { player: string; mode: string; streak: number; at: string }[];
};

export type Member = {
  id: string;
  minecraftUsername: string;
  discordUsername: string;
  linked: boolean;
  roles: UserRole[];
  lastSeen: string;
  warnings: number;
  punishments: number;
  notes: string;
};

export type StaffMember = {
  id: string;
  displayName: string;
  minecraftUsername: string;
  discordUsername: string;
  role: UserRole;
  linked: boolean;
  activityHours: number;
  ticketsHandled: number;
  moderationActions: number;
  quotaProgress: number;
  permissions: string[];
};

export type Ticket = {
  id: string;
  title: string;
  type: "Support" | "Appeal" | "Report" | "Store" | "Bug";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "claimed" | "waiting" | "closed";
  claimedBy?: string;
  lastActivity: string;
  requester: string;
};

export type Punishment = {
  id: string;
  player: string;
  type: "warning" | "mute" | "kick" | "ban";
  reason: string;
  issuedBy: string;
  issuedAt: string;
  evidence: "pending" | "attached" | "missing";
  approval: "approved" | "pending" | "rejected";
  severity: "low" | "medium" | "high";
};

export type QuotaReport = {
  weekLabel: string;
  requirements: {
    tickets: number;
    moderationActions: number;
    activityHours: number;
    messages: number;
  };
  staff: {
    staffId: string;
    name: string;
    role: UserRole;
    messages: number;
    tickets: number;
    moderationActions: number;
    activityHours: number;
    progress: number;
  }[];
};

export type IntegrationStatus = {
  key: string;
  label: string;
  status: Status;
  envVars: string[];
  description: string;
};

const hours = ["00", "03", "06", "09", "12", "15", "18", "21"];

export const overviewStats: OverviewStats = {
  serverName: "Dog SMP",
  networkRank: 18,
  networkTotal: 250,
  minecraftStatus: "online",
  discordStatus: "online",
  playersOnline: 87,
  playersMax: 140,
  peakRecord: 126,
  peakTarget: 150,
  discordOnline: 318,
  discordMembers: 4821,
  weeklyMinecraftGrowth: 12,
  weeklyDiscordGrowth: 7,
  uptimePercent: 99.94,
  averagePlayersPerDay: 73,
  activity: hours.map((label, index) => ({
    label,
    minecraftPlayers: [28, 22, 34, 49, 76, 91, 87, 64][index],
    discordOnline: [140, 132, 165, 204, 256, 318, 302, 244][index],
  })),
};

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hourLabels = Array.from({ length: 24 }, (_, hour) => hour);

function makeActivity(range: AnalyticsRange): TimePoint[] {
  const rangeBump: Record<AnalyticsRange, number> = {
    live: 0,
    "1h": 4,
    "24h": 8,
    "30d": 16,
    max: 24,
    "last-week": 12,
  };

  return Array.from({ length: 18 }, (_, index) => {
    const base = 34 + Math.round(Math.sin(index / 2) * 13) + index * 3;
    const players = base + rangeBump[range] + (index % 5 === 0 ? 16 : 0);
    return {
      label: `${String((index * 2) % 24).padStart(2, "0")}:00`,
      minecraftPlayers: players,
      discordOnline: players * 3 + 86 + (index % 4) * 9,
    };
  });
}

export function getMockAnalytics(range: AnalyticsRange): AnalyticsData {
  return {
    range,
    playerCount: makeActivity(range),
    discordMembers: Array.from({ length: 18 }, (_, index) => ({
      label: `${String((index * 2) % 24).padStart(2, "0")}:00`,
      value: 4560 + index * 15 + Math.round(Math.sin(index / 2) * 22),
    })),
    hourlyHeatmap: dayLabels.map((day, dayIndex) => ({
      day,
      values: hourLabels.map((hour) => {
        const eveningPeak = hour >= 14 && hour <= 22 ? 38 : 8;
        const weekend = dayIndex >= 5 ? 24 : 0;
        return Math.max(4, 14 + eveningPeak + weekend + Math.round(Math.sin(hour / 2) * 12));
      }),
    })),
    dayBars: dayLabels.map((label, index) => ({
      label,
      players: [58, 61, 67, 74, 86, 118, 101][index],
      discord: [210, 224, 242, 260, 292, 350, 331][index],
    })),
    insights: [
      "Weekends carry you.",
      "Saturday is your strongest day.",
      "Peak happened around 15:00 server time.",
    ],
  };
}

export const servers: MinecraftServer[] = [
  {
    id: "survival",
    name: "Survival Main",
    address: "play.dogsmp.net",
    status: "online",
    version: "Paper 1.21.4",
    latencyMs: 32,
    uptimePercent: 99.98,
    playersOnline: 87,
    playersMax: 140,
    recordPlayers: 126,
    pluginConnection: "online",
    lastPluginPing: new Date(Date.now() - 45_000).toISOString(),
  },
  {
    id: "arena",
    name: "Arena / PvP",
    address: "arena.dogsmp.net",
    status: "degraded",
    version: "Paper 1.21.4",
    latencyMs: 76,
    uptimePercent: 98.42,
    playersOnline: 22,
    playersMax: 64,
    recordPlayers: 58,
    pluginConnection: "syncing",
    lastPluginPing: new Date(Date.now() - 4 * 60_000).toISOString(),
  },
  {
    id: "events",
    name: "Events",
    address: "events.dogsmp.net",
    status: "offline",
    version: "Paper 1.21.4",
    latencyMs: 0,
    uptimePercent: 91.2,
    playersOnline: 0,
    playersMax: 80,
    recordPlayers: 73,
    pluginConnection: "offline",
    lastPluginPing: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
  },
];

export const arenaData: ArenaData = {
  status: "online",
  queueCount: 9,
  activePlayers: 18,
  matches: [
    {
      id: "arena-2184",
      mode: "Crystal 2v2",
      map: "Basalt Ring",
      status: "live",
      players: ["Astra", "Mango", "Kite", "Ferox"],
      startedAt: new Date(Date.now() - 7 * 60_000).toISOString(),
    },
    {
      id: "arena-2185",
      mode: "Sword 1v1",
      map: "Copper Yard",
      status: "queued",
      players: ["Hex", "Warden"],
      startedAt: new Date(Date.now() + 3 * 60_000).toISOString(),
    },
    {
      id: "arena-2181",
      mode: "UHC 3v3",
      map: "Mesa Cut",
      status: "finished",
      players: ["Nova", "Byte", "Rin", "Vox", "Rune", "Juno"],
      startedAt: new Date(Date.now() - 46 * 60_000).toISOString(),
    },
  ],
  recentWinners: [
    { player: "Astra", mode: "Crystal 2v2", streak: 5, at: "12m ago" },
    { player: "Nova", mode: "UHC 3v3", streak: 3, at: "34m ago" },
    { player: "Hex", mode: "Sword 1v1", streak: 8, at: "1h ago" },
  ],
};

export const members: Member[] = [
  {
    id: "m-001",
    minecraftUsername: "Astra",
    discordUsername: "astra.gg",
    linked: true,
    roles: ["staff"],
    lastSeen: new Date(Date.now() - 12 * 60_000).toISOString(),
    warnings: 0,
    punishments: 0,
    notes: "Active helper candidate.",
  },
  {
    id: "m-002",
    minecraftUsername: "MangoMine",
    discordUsername: "mango.mine",
    linked: true,
    roles: [],
    lastSeen: new Date(Date.now() - 3 * 60 * 60_000).toISOString(),
    warnings: 2,
    punishments: 1,
    notes: "Watch chat escalation.",
  },
  {
    id: "m-003",
    minecraftUsername: "Ferox",
    discordUsername: "ferox",
    linked: false,
    roles: [],
    lastSeen: new Date(Date.now() - 28 * 60_000).toISOString(),
    warnings: 1,
    punishments: 0,
    notes: "Pending link confirmation.",
  },
  {
    id: "m-004",
    minecraftUsername: "Kite",
    discordUsername: "kite.pvp",
    linked: true,
    roles: ["admin"],
    lastSeen: new Date(Date.now() - 18 * 60 * 60_000).toISOString(),
    warnings: 0,
    punishments: 0,
    notes: "Arena coordinator.",
  },
  {
    id: "m-005",
    minecraftUsername: "Rune",
    discordUsername: "rune_13",
    linked: true,
    roles: [],
    lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60_000).toISOString(),
    warnings: 4,
    punishments: 2,
    notes: "Appeal eligible in next review.",
  },
];

export const staffMembers: StaffMember[] = [
  {
    id: "s-001",
    displayName: "Rin",
    minecraftUsername: "RinBlocks",
    discordUsername: "rin.staff",
    role: "staff",
    linked: true,
    activityHours: 13.5,
    ticketsHandled: 18,
    moderationActions: 7,
    quotaProgress: 82,
    permissions: ["Assigned tickets", "Basic members", "Own quota"],
  },
  {
    id: "s-002",
    displayName: "Byte",
    minecraftUsername: "ByteForge",
    discordUsername: "byte.admin",
    role: "admin",
    linked: true,
    activityHours: 21.2,
    ticketsHandled: 32,
    moderationActions: 19,
    quotaProgress: 118,
    permissions: ["Punishments", "Members", "Server moderation"],
  },
  {
    id: "s-003",
    displayName: "Nova",
    minecraftUsername: "NovaOps",
    discordUsername: "nova.manager",
    role: "manager",
    linked: true,
    activityHours: 18.8,
    ticketsHandled: 21,
    moderationActions: 12,
    quotaProgress: 104,
    permissions: ["Roles", "Settings", "Quota reports"],
  },
  {
    id: "s-004",
    displayName: "Glitch",
    minecraftUsername: "GlitchPatch",
    discordUsername: "glitch.dev",
    role: "dev",
    linked: true,
    activityHours: 9.5,
    ticketsHandled: 8,
    moderationActions: 4,
    quotaProgress: 76,
    permissions: ["Debug", "Integration status", "Settings"],
  },
];

export const tickets: Ticket[] = [
  {
    id: "TCK-1482",
    title: "Lost inventory after arena restart",
    type: "Bug",
    priority: "high",
    status: "open",
    requester: "Astra",
    lastActivity: new Date(Date.now() - 8 * 60_000).toISOString(),
  },
  {
    id: "TCK-1481",
    title: "Appeal for temp mute",
    type: "Appeal",
    priority: "medium",
    status: "claimed",
    claimedBy: "Rin",
    requester: "Rune",
    lastActivity: new Date(Date.now() - 31 * 60_000).toISOString(),
  },
  {
    id: "TCK-1479",
    title: "Report: combat logging",
    type: "Report",
    priority: "urgent",
    status: "waiting",
    claimedBy: "Byte",
    requester: "MangoMine",
    lastActivity: new Date(Date.now() - 54 * 60_000).toISOString(),
  },
  {
    id: "TCK-1476",
    title: "Rank purchase not applied",
    type: "Store",
    priority: "low",
    status: "closed",
    claimedBy: "Nova",
    requester: "Hex",
    lastActivity: new Date(Date.now() - 9 * 60 * 60_000).toISOString(),
  },
];

export const punishments: Punishment[] = [
  {
    id: "PUN-924",
    player: "Rune",
    type: "mute",
    reason: "Repeated chat filter evasion",
    issuedBy: "Byte",
    issuedAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString(),
    evidence: "attached",
    approval: "approved",
    severity: "medium",
  },
  {
    id: "PUN-923",
    player: "MangoMine",
    type: "warning",
    reason: "Spawn grief attempt",
    issuedBy: "Rin",
    issuedAt: new Date(Date.now() - 8 * 60 * 60_000).toISOString(),
    evidence: "pending",
    approval: "pending",
    severity: "low",
  },
  {
    id: "PUN-920",
    player: "CopperFox",
    type: "ban",
    reason: "Client modification confirmed",
    issuedBy: "Nova",
    issuedAt: new Date(Date.now() - 2 * 24 * 60 * 60_000).toISOString(),
    evidence: "attached",
    approval: "approved",
    severity: "high",
  },
  {
    id: "PUN-916",
    player: "Ferox",
    type: "kick",
    reason: "Refused staff screen share",
    issuedBy: "Byte",
    issuedAt: new Date(Date.now() - 4 * 24 * 60 * 60_000).toISOString(),
    evidence: "missing",
    approval: "pending",
    severity: "medium",
  },
];

export const quotaReport: QuotaReport = {
  weekLabel: "Week 26",
  requirements: {
    tickets: 12,
    moderationActions: 6,
    activityHours: 10,
    messages: 80,
  },
  staff: [
    {
      staffId: "s-001",
      name: "Rin",
      role: "staff",
      messages: 124,
      tickets: 18,
      moderationActions: 7,
      activityHours: 13.5,
      progress: 82,
    },
    {
      staffId: "s-002",
      name: "Byte",
      role: "admin",
      messages: 212,
      tickets: 32,
      moderationActions: 19,
      activityHours: 21.2,
      progress: 118,
    },
    {
      staffId: "s-003",
      name: "Nova",
      role: "manager",
      messages: 188,
      tickets: 21,
      moderationActions: 12,
      activityHours: 18.8,
      progress: 104,
    },
    {
      staffId: "s-004",
      name: "Glitch",
      role: "dev",
      messages: 64,
      tickets: 8,
      moderationActions: 4,
      activityHours: 9.5,
      progress: 76,
    },
  ],
};

export const integrationStatus: IntegrationStatus[] = [
  {
    key: "discord-oauth",
    label: "Discord OAuth",
    status: "offline",
    envVars: ["VITE_DISCORD_CLIENT_ID", "VITE_DISCORD_REDIRECT_URI"],
    description: "Prepared for future OAuth login and guild role sync.",
  },
  {
    key: "discord-bot",
    label: "Discord Bot/Webhooks",
    status: "syncing",
    envVars: [
      "DISCORD_BOT_TOKEN",
      "DISCORD_STATUS_WEBHOOK_URL",
      "DISCORD_WEBHOOK_MC_PUNISHMENTS",
      "DISCORD_WEBHOOK_ANTICHEAT",
      "PANEL_WEBHOOK_API_KEY",
    ],
    description: "Server-side proxy placeholders for ticket, log, punishment, and anticheat webhooks.",
  },
  {
    key: "plugin-api",
    label: "Minecraft Plugin API",
    status: "degraded",
    envVars: ["MINECRAFT_PLUGIN_API_URL", "VITE_PANEL_API_BASE_URL"],
    description: "Future bridge for link status, playtime, pruning, and inventory snapshots.",
  },
  {
    key: "role-map",
    label: "Discord Role Map",
    status: "online",
    envVars: Object.values(ROLE_IDS),
    description: "Role IDs are wired into frontend permissions for mock gating.",
  },
];
