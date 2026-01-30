"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuditLogs } from "@/features/audit-logs";
import { AdminPageGuard } from "@/components/auth/AdminPageGuard";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AdminAuditLogsHeader } from "@/features/audit-logs/components/AdminAuditLogsHeader";
import { AdminAuditLogsFilters } from "@/features/audit-logs/components/AdminAuditLogsFilters";
import { AuditDiffAccordion } from "@/features/audit-logs/components/AuditDiffAccordion";
import { ActorCell } from "@/features/audit-logs/components/ActorCell";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
} from "@/components/ui/pagination";


function ActionBadge({ action }: { action: string }) {
    const color =
        action === "CREATE"
            ? "bg-green-100 text-green-700"
            : action === "UPDATE"
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700";

    return <Badge className={color}>{action}</Badge>;
}

export default function AuditLogsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [action, setAction] = useState("all");
    const [entity, setEntity] = useState("all");

    const [page, setPage] = useState(1);
    const limit = 20;

    // const { data, isLoading } = useAuditLogs(page, limit);
    const { data, isLoading } = useAuditLogs({
        page,
        limit,
        search: searchTerm,
        action,
        entity
    });

    const totalPages = data
        ? Math.ceil(data.total / data.limit)
        : 1;

    return (
        <AdminPageGuard requiredRole="admin">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <AdminAuditLogsHeader />
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
                    <AdminAuditLogsFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        action={action}
                        setAction={setAction}
                        entity={entity}
                        setEntity={setEntity}
                        setPage={setPage}
                    />
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>İşlem Kayıtları (Audit Log)</CardTitle>
                            </CardHeader>

                            <CardContent>
                                {isLoading ? (
                                    <p className="text-sm text-muted-foreground">Yükleniyor...</p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tarih</TableHead>
                                                <TableHead>İşlem</TableHead>
                                                <TableHead>Varlık</TableHead>
                                                <TableHead>Kayıt ID</TableHead>
                                                <TableHead>Kullanıcı</TableHead>
                                                <TableHead>Endpoint</TableHead>
                                                <TableHead>Değişiklik</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data?.items.map((log) => (
                                                <TableRow key={log._id}>
                                                    <TableCell className="whitespace-nowrap">
                                                        {new Date(log.createdAt).toLocaleString("tr-TR")}
                                                    </TableCell>

                                                    <TableCell>
                                                        <ActionBadge action={log.action} />
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge variant="outline">{log.entity}</Badge>
                                                    </TableCell>

                                                    <TableCell className="font-mono text-xs">
                                                        {log.entityId}
                                                    </TableCell>

                                                    <TableCell>
                                                        <ActorCell actor={log.actor} />
                                                    </TableCell>

                                                    <TableCell className="text-xs text-muted-foreground">
                                                        {log.request?.path}
                                                    </TableCell>
                                                    <TableCell className="align-top w-[320px]">
                                                        <AuditDiffAccordion
                                                            id={log._id}
                                                            before={log.before}
                                                            after={log.after}
                                                            changes={log.changes}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>

                        <Pagination className="mt-6">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage((p) => Math.max(1, p - 1));
                                        }}
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const p = i + 1;
                                    return (
                                        <PaginationItem key={p}>
                                            <PaginationLink
                                                href="#"
                                                isActive={p === page}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPage(p);
                                                }}
                                            >
                                                {p}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage((p) => Math.min(totalPages, p + 1));
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </motion.div>
        </AdminPageGuard>
    );
}
