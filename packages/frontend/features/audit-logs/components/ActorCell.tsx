"use client";

type Actor = {
    userId: string;
    email?: string;
    role?: string;
};

export function ActorCell({ actor }: { actor: Actor }) {
    return (
        <div className="flex flex-col">
            <span className="font-medium">
                {actor.email ?? actor.userId}
            </span>

            {actor.role && (
                <span className="text-xs text-muted-foreground">
                    {actor.role}
                </span>
            )}
        </div>
    );
}

