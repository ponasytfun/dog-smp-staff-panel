import {
  ROLE_IDS,
  RoleId,
  UserRole,
  roleDisplayNames,
} from "./permissions";

export type MockUser = {
  id: string;
  displayName: string;
  discordUsername: string;
  minecraftUsername: string;
  role: UserRole;
  roleId: RoleId;
  avatarInitials: string;
};

export const mockUsers: MockUser[] = [
  {
    id: "mock-staff",
    displayName: "Rin",
    discordUsername: "rin.staff",
    minecraftUsername: "RinBlocks",
    role: "staff",
    roleId: ROLE_IDS.staff,
    avatarInitials: "RS",
  },
  {
    id: "mock-admin",
    displayName: "Byte",
    discordUsername: "byte.admin",
    minecraftUsername: "ByteForge",
    role: "admin",
    roleId: ROLE_IDS.admin,
    avatarInitials: "BA",
  },
  {
    id: "mock-manager",
    displayName: "Nova",
    discordUsername: "nova.manager",
    minecraftUsername: "NovaOps",
    role: "manager",
    roleId: ROLE_IDS.manager,
    avatarInitials: "NM",
  },
  {
    id: "mock-dev",
    displayName: "Glitch",
    discordUsername: "glitch.dev",
    minecraftUsername: "GlitchPatch",
    role: "dev",
    roleId: ROLE_IDS.dev,
    avatarInitials: "GD",
  },
];

export const DEFAULT_MOCK_USER_ID = "mock-manager";

export function getMockUser(userId: string): MockUser {
  return (
    mockUsers.find((user) => user.id === userId) ??
    mockUsers.find((user) => user.id === DEFAULT_MOCK_USER_ID) ??
    mockUsers[0]
  );
}

export function getAuthProviderLabel(user: MockUser): string {
  return `${roleDisplayNames[user.role]} mock session`;
}
