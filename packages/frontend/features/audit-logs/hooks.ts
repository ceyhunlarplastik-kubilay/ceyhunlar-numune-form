"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogs } from "./fetchers";

export function useAuditLogs(params: {
    page: number;
    limit: number;
    search?: string;
    action?: string;
    entity?: string;
}) {
    return useQuery({
        queryKey: ["audit-logs", params],
        queryFn: () => fetchAuditLogs(params),
        // keepPreviousData: true, // 🔥 pagination UX
    });
}
