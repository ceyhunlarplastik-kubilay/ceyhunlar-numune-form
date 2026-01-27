"use client";

import Image from "next/image";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";

import type { Product } from "@/features/products/types";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   PROPS                                    */
/* -------------------------------------------------------------------------- */

interface Props {
    products: Product[];
    loading: boolean;
    fetching?: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

/* -------------------------------------------------------------------------- */
/*                                   COMPONENT                                */
/* -------------------------------------------------------------------------- */

export function ProductTable({
    products,
    loading,
    fetching = false,
    page,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
}: Props) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                    Ürünler yükleniyor...
                </p>
            </div>
        );
    }

    if (!products.length) {
        return (
            <div className="py-24 text-center text-muted-foreground">
                Ürün bulunamadı
            </div>
        );
    }

    return (
            <div className="relative rounded-lg border bg-white overflow-hidden">
                {/* SOFT LOADING OVERLAY */}
                <AnimatePresence>
                    {fetching && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm cursor-progress"
                        >
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Güncelleniyor...
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* TABLE */}
                <div
                    className={cn(
                        "transition-opacity",
                        fetching && "opacity-60"
                    )}
                >
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow>
                                    <TableHead className="w-[20]">Görsel</TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Ürün Adı</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Açıklama
                                    </TableHead>
                                    <TableHead className="text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                <AnimatePresence>
                                    {products.map((p) => (
                                        <motion.tr
                                            layout
                                            key={p._id}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="border-b last:border-0 hover:bg-muted/30"
                                        >
                                            <TableCell>
                                                {p.imageUrl ? (
                                                    <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                                                        <Image
                                                            src={`${p.imageUrl}?v=${p.updatedAt|| Date.now()}`}
                                                            alt={p.name}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                                        YOK
                                                    </div>
                                                )}
                                            </TableCell>

                                            <TableCell className="font-medium">
                                                {p._id}
                                            </TableCell>

                                            <TableCell className="font-medium">
                                                {p.name}
                                            </TableCell>

                                            <TableCell className="hidden md:table-cell text-muted-foreground truncate max-w-md">
                                                {p.description || "-"}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => onEdit(p._id)}
                                                    >
                                                        <Pencil className="w-4 h-4 text-blue-600" />
                                                    </Button>

                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => onDelete(p._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>

                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </div>
                {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                    <Pagination>
                        <PaginationContent>
                            {/* PREVIOUS */}
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(Math.max(1, page - 1));
                                    }}
                                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {/* PAGE NUMBERS */}
                            {Array.from({ length: totalPages }).map((_, i) => {
                                const pageNumber = i + 1;

                                // çok fazla sayfa varsa ortayı göster
                                if (
                                    totalPages > 7 &&
                                    pageNumber !== 1 &&
                                    pageNumber !== totalPages &&
                                    Math.abs(pageNumber - page) > 1
                                ) {
                                    if (pageNumber === page - 2 || pageNumber === page + 2) {
                                        return (
                                            <PaginationItem key={pageNumber}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }
                                    return null;
                                }

                                return (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === pageNumber}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onPageChange(pageNumber);
                                            }}
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            {/* NEXT */}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(Math.min(totalPages, page + 1));
                                    }}
                                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
            </div>
    );
}
