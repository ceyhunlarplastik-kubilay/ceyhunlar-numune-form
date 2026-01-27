"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Product } from "@/features/products/types";

type DeleteProductPreview = Pick<Product, "_id" | "name">;

interface ProductsAlertDialogProps {
    deletingProduct: DeleteProductPreview | null;
    setDeletingProduct: (product: DeleteProductPreview | null) => void;
    deleteMutation: {
        mutate: (args: { productId: string }) => void;
    };
}

export function ProductsAlertDialog({
    deletingProduct,
    setDeletingProduct,
    deleteMutation
}: ProductsAlertDialogProps) {
    return (
        <AlertDialog
            open={!!deletingProduct}
            onOpenChange={() => setDeletingProduct(null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Ürünü Sil</AlertDialogTitle>
                    <AlertDialogDescription>
                        <strong>{deletingProduct?.name}</strong> ürünü kalıcı olarak
                        silinecek.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive"
                        onClick={() => {
                            if (!deletingProduct) return;
                            deleteMutation.mutate({
                                productId: deletingProduct._id,
                            });
                            setDeletingProduct(null);
                        }}
                    >
                        Sil
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}