import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function getActorFromSession() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthenticated");

    const client = await clerkClient();

    const user = await client.users.getUser(userId);

    const email =
        user.emailAddresses.find(
            e => e.id === user.primaryEmailAddressId
        )?.emailAddress;

    return {
        userId,
        email,
        role: user.publicMetadata?.role,
    };
}


