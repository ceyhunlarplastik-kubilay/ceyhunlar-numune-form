import mongoose, { Schema, Document } from "mongoose";
import { Roles } from "@/types/globals";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE";
export type AuditEntity = "Sector" | "ProductionGroup" | "Product";

export interface IAuditLog extends Document {
    action: AuditAction;
    entity: AuditEntity;

    // hangi kayda etki etti
    entityId: string;

    // kim yaptı
    actor: {
        userId: string;
        email?: string;
        role?: Roles;
    };

    // istek bilgisi (debug için altın değerinde)
    request?: {
        path?: string;
        ip?: string;
        userAgent?: string;
    };

    // değişiklik
    before?: any;   // DELETE veya UPDATE öncesi
    after?: any;    // CREATE veya UPDATE sonrası
    changes?: any;  // UPDATE için diff/patch (opsiyonel)

    createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        action: { type: String, required: true, enum: ["CREATE", "UPDATE", "DELETE"], index: true },
        entity: { type: String, required: true, enum: ["Sector", "ProductionGroup", "Product"], index: true },
        entityId: { type: String, required: true, index: true },

        actor: {
            userId: { type: String, required: true, index: true },
            email: String,
            role: String,
        },

        request: {
            path: String,
            ip: String,
            userAgent: String,
        },

        before: Schema.Types.Mixed,
        after: Schema.Types.Mixed,
        changes: Schema.Types.Mixed,
    },
    { timestamps: { createdAt: true, updatedAt: false }, collection: "audit_logs" }
);

// Sık sorgular için
AuditLogSchema.index({ entity: 1, entityId: 1, createdAt: -1 });
AuditLogSchema.index({ actor: 1, createdAt: -1 });

export const AuditLog =
    mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
