import { Roles } from "@/types/globals";

export interface AuditLogs {
    _id: string;
    action: string;
    entity?: string;
    entityId: string;
    actor: {
        userId: string;
        email?: string;
        role?: Roles;
    };

    request?: {
        path?: string;
        ip?: string;
        userAgent?: string;
    };

    before?: any;
    after?: any;
    changes?: any;

    createdAt: string;
    updatedAt?: string;
}
