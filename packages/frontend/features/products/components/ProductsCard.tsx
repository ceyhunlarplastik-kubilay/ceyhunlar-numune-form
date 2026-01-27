"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { ProductTable } from "@/features/products/components/ProductTable";
import type { Product } from "@/features/products/types";

interface ProductsCardProps {
    products: Product[];
    loading: boolean;
    fetching?: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    setDeletingProduct: (product: Product | null) => void;
    total: number;
    openCreate: () => void;
}

export function ProductsCard({
    products,
    loading,
    fetching = false,
    page,
    totalPages,
    total,
    onPageChange,
    onEdit,
    onDelete,
    setDeletingProduct,
    openCreate
}: ProductsCardProps) {
    return (
        <main className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-4 border-b bg-muted/40">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold tracking-tight">
                            Ürün Listesi
                        </CardTitle>

                        <CardDescription className="text-sm text-muted-foreground">
                            Bu sayfada{" "}
                            <span className="font-semibold text-foreground">
                                {products.length}
                            </span>{" "}
                            ürün gösteriliyor · Toplam{" "}
                            <span className="font-semibold text-foreground">
                                {total}
                            </span>{" "}
                            ürün (
                            <span className="font-semibold text-foreground">
                                {totalPages}
                            </span>{" "}
                            sayfa)
                        </CardDescription>
                    </div>

                    <Button onClick={openCreate} className="shrink-0">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Ürün Ekle
                    </Button>
                </CardHeader>

                <CardContent>
                    <ProductTable
                        products={products}
                        loading={loading}
                        fetching={fetching}
                        page={page}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        onEdit={onEdit}
                        onDelete={(id) =>
                            setDeletingProduct(
                                products.find((p) => p._id === id) ?? null
                            )
                        }
                    />
                </CardContent>
            </Card>
        </main>
    )
}