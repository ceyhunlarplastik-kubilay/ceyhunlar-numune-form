import { Roles } from "@/types/globals";
import { currentUser } from "@clerk/nextjs/server";

const ROLE_LEVEL: Record<Roles, number> = {
  moderator: 1,
  admin: 2,
  owner: 3,
};

export async function getUserRole(): Promise<Roles | null> {
  const user = await currentUser();
  return (user?.publicMetadata?.role as Roles) ?? null;
}

export async function hasAtLeastRole(required: Roles): Promise<boolean> {
  const role = await getUserRole();
  if (!role) return false;

  return ROLE_LEVEL[role] >= ROLE_LEVEL[required];
}

export async function hasExactRole(required: Roles): Promise<boolean> {
  const role = await getUserRole();
  return role === required;
}
