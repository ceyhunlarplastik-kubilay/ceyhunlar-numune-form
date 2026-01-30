import axios from "axios";
import type { AuditLogs } from "./types";

interface FetchAuditLogsParams {
  page: number;
  limit: number;
  search?: string;
  action?: string;
  entity?: string;
}

export interface AuditLogsResponse {
    items: AuditLogs[];
    total: number;
    page: number;
    limit: number;
}

export async function fetchAuditLogs(params: FetchAuditLogsParams): Promise<AuditLogsResponse> {
    const { data } = await axios.get("/api/audit-logs", {
        params,
    });
    return data;
}
