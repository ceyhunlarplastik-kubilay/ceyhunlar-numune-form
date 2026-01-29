import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Roles } from "@/types/globals";

/**
 * Rol hiyerarşisi
 * owner > admin > moderator > user
 */
const ROLE_LEVEL: Record<Roles, number> = {
    moderator: 1,
    admin: 2,
    owner: 3,
};

/**
 * En az belirtilen role sahip mi?
 * (admin ⇒ admin + owner)
 */
export async function requireAtLeastRole(required: Roles) {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const role = sessionClaims?.metadata?.role as Roles | undefined;

    if (!role || ROLE_LEVEL[role] < ROLE_LEVEL[required]) {
        return NextResponse.json(
            { error: "Forbidden" },
            { status: 403 }
        );
    }

    return null;
}

/**
 * Sadece belirli rol (örn: sadece owner)
 */
export async function requireExactRole(required: Roles) {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    if (sessionClaims?.metadata?.role !== required) {
        return NextResponse.json(
            { error: "Forbidden" },
            { status: 403 }
        );
    }

    return null;
}

