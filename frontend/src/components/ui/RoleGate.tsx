import { ReactNode } from "react";
import { Lock } from "lucide-react";
import { MockUser } from "../../lib/auth";
import { Permission, hasPermission } from "../../lib/permissions";
import { PixelButton } from "./PixelButton";

type RoleGateProps = {
  user: MockUser;
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
};

export function RoleGate({ user, permission, children, fallback }: RoleGateProps) {
  if (hasPermission(user.role, permission)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <PixelButton aria-label="Permission locked" disabled icon={<Lock size={14} />}>
      Locked
    </PixelButton>
  );
}
