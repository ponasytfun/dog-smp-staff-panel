import {
  AnalyticsData,
  AnalyticsRange,
  ArenaData,
  IntegrationStatus,
  Member,
  MinecraftServer,
  OverviewStats,
  Punishment,
  QuotaReport,
  StaffMember,
  Ticket,
  arenaData,
  getMockAnalytics,
  integrationStatus,
  members,
  overviewStats,
  punishments,
  quotaReport,
  servers,
  staffMembers,
  tickets,
} from "../data/mockData";

function clone<T>(value: T): T {
  return structuredClone(value);
}

function mockDelay<T>(value: T, delayMs = 260): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(clone(value)), delayMs);
  });
}

export function getOverviewStats(): Promise<OverviewStats> {
  return mockDelay(overviewStats);
}

export function getAnalytics(range: AnalyticsRange): Promise<AnalyticsData> {
  return mockDelay(getMockAnalytics(range));
}

export function getServers(): Promise<MinecraftServer[]> {
  return mockDelay(servers);
}

export function getArena(): Promise<ArenaData> {
  return mockDelay(arenaData);
}

export function getMembers(): Promise<Member[]> {
  return mockDelay(members);
}

export function getStaff(): Promise<StaffMember[]> {
  return mockDelay(staffMembers);
}

export function getTickets(): Promise<Ticket[]> {
  return mockDelay(tickets);
}

export function getPunishments(): Promise<Punishment[]> {
  return mockDelay(punishments);
}

export function getQuotaReport(): Promise<QuotaReport> {
  return mockDelay(quotaReport);
}

export function getIntegrationStatus(): Promise<IntegrationStatus[]> {
  return mockDelay(integrationStatus);
}
