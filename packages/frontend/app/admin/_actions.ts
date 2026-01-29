"use server";

import { hasAtLeastRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { Roles } from "@/types/globals";

export async function setRole(formData: FormData): Promise<void> {
    // 🔐 Sadece admin veya owner
    if (!(await hasAtLeastRole("admin"))) {
        console.log("Not Authorized");
        return;
    }

    const userId = formData.get("id") as string | null;
    const role = formData.get("role") as Roles | null;

    if (!userId || !role) {
        console.error("Missing userId or role");
        return;
    }

    try {
        const client = await clerkClient();

        const res = await client.users.updateUserMetadata(userId, {
            publicMetadata: { role },
        });

        console.log("Role updated:", res.publicMetadata);
    } catch (err) {
        console.error("Error updating role:", err);
    }
}

export async function removeRole(formData: FormData): Promise<void> {
    // 🔐 Sadece admin veya owner
    if (!(await hasAtLeastRole("admin"))) {
        console.log("Not Authorized");
        return;
    }

    const userId = formData.get("id") as string | null;

    if (!userId) {
        console.error("Missing userId");
        return;
    }

    try {
        const client = await clerkClient();

        const res = await client.users.updateUserMetadata(userId, {
            publicMetadata: { role: null },
        });

        console.log("Role removed:", res.publicMetadata);
    } catch (err) {
        console.error("Error removing role:", err);
    }
}
