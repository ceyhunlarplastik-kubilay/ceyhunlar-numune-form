"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { Roles } from "@/types/globals";

const ROLE_LEVEL: Record<Roles, number> = {
    moderator: 1,
    admin: 2,
    owner: 3,
};

export function useClientRole() {
    const { isLoaded: authLoaded } = useAuth();
    const { user, isLoaded: userLoaded } = useUser();

    // const role = sessionClaims?.metadata?.role as Roles | undefined;
    const isLoaded = authLoaded && userLoaded;
    const role = user?.publicMetadata?.role as Roles | undefined;

    function hasAtLeast(required: Roles) {
        if (!role) return false;
        return ROLE_LEVEL[role] >= ROLE_LEVEL[required];
    }

    function hasExact(required: Roles) {
        return role === required;
    }

    return {
        isLoaded,
        role,
        canViewCustomers: hasAtLeast("moderator"),
        canManageCustomers: hasAtLeast("admin"),
        canExportCustomers: hasExact("owner"),
    };
}
