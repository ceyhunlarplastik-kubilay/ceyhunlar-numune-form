import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/models";
import { requireAtLeastRole } from "@/lib/auth";

export async function GET(req: Request) {
    const authError = await requireAtLeastRole("admin");
    if (authError) return authError;

    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search");
        const action = searchParams.get("action");
        const entity = searchParams.get("entity");
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (action && action !== "all") {
            filter.action = action;
        }

        if (entity && entity !== "all") {
            filter.entity = entity;
        }

        if (search) {
            filter.$or = [
                { entityId: { $regex: search, $options: "i" } },
                { "actor.email": { $regex: search, $options: "i" } },
                { "request.path": { $regex: search, $options: "i" } },
            ];
        }

        const total = await AuditLog.countDocuments();

        const items = await AuditLog.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({
            items,
            total,
            page,
            limit,
        });
    } catch (error) {
        console.error("AuditLogs API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
