"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import type { Sector } from "@/features/sectors";
import { toastSuccess, toastError } from "@/lib/toast-helpers";

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

interface ProductionGroup {
    _id: string;
    name: string;
}

interface AdminSectorDeleteDialogProps {
    sector: Sector | null;
    onClose: () => void;
}

export function AdminSectorDeleteDialog({ sector, onClose }: AdminSectorDeleteDialogProps) {
    const qc = useQueryClient();

    const [dependentGroups, setDependentGroups] = useState<ProductionGroup[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(false);

    // Dialog açılınca production groups kontrol et
    useEffect(() => {
        let cancelled = false;

        async function loadDependentGroups() {
            if (!sector?._id) return;

            setLoadingGroups(true);
            setDependentGroups([]);

            try {
                const { data } = await axios.get("/api/production-groups", {
                    params: { sectorId: sector._id },
                });

                if (!cancelled) {
                    setDependentGroups(Array.isArray(data) ? data : []);
                }
            } catch {
                if (!cancelled) setDependentGroups([]);
            } finally {
                if (!cancelled) setLoadingGroups(false);
            }
        }

        if (sector) loadDependentGroups();

        return () => {
            cancelled = true;
        };
    }, [sector?._id]); // sector değişince yeniden kontrol

    const deleteMutation = useMutation({
        mutationFn: async (sector: Sector) => {
            // 1) S3 image sil
            if (sector.imageUrl) {
                await axios
                    .delete("/api/sectors/upload", {
                        params: { url: sector.imageUrl },
                    })
                    .catch(() => { });
            }

            // 2) sector sil
            await axios.delete("/api/sectors", {
                params: { id: sector._id },
            });
        },
        onSuccess: () => {
            toastSuccess("Sektör silindi");
            qc.invalidateQueries({ queryKey: ["sectors"] });
            onClose();
        },
        onError: (e: any) => {
            // backend "bağlı group var" diye özel hata dönüyorsa buraya düşer
            if (e.response?.data?.details?.action) {
                toastError(e.response.data.error, {
                    description: e.response.data.details.action,
                    duration: 5000,
                });
            } else {
                toastError(e.response?.data?.error || "Silinemedi");
            }
        },
    });

    const hasDependencies = dependentGroups.length > 0;
    const disableDelete =
        !sector ||
        loadingGroups ||
        hasDependencies ||
        deleteMutation.isPending;

    return (
        <AlertDialog open={!!sector} onOpenChange={(o) => !o && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Sektörü Sil</AlertDialogTitle>

                    <AlertDialogDescription>
                        <strong>{sector?.name}</strong> sektörü silinecek.
                    </AlertDialogDescription>

                    <div className="space-y-3 mt-3">
                        {loadingGroups && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Üretim grupları kontrol ediliyor...
                            </div>
                        )}

                        {!loadingGroups && hasDependencies && (
                            <div className="rounded-md border bg-muted/50 p-3 space-y-2">
                                <p className="text-sm font-medium text-destructive">
                                    Bu sektöre bağlı üretim grupları var:
                                </p>

                                <ul className="list-disc pl-5 text-sm">
                                    {dependentGroups.map((g) => (
                                        <li key={g._id}>{g.name}</li>
                                    ))}
                                </ul>

                                <p className="text-xs text-muted-foreground">
                                    Bu grupları silmeden sektörü silemezsiniz.
                                </p>
                            </div>
                        )}
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>

                    <AlertDialogAction
                        type="button"
                        disabled={disableDelete}
                        className={
                            disableDelete
                                ? "opacity-50 cursor-not-allowed"
                                : "bg-destructive hover:bg-destructive/90"
                        }
                        onClick={() => {
                            if (sector && !hasDependencies) {
                                deleteMutation.mutate(sector);
                            }
                        }}
                    >
                        {(loadingGroups || deleteMutation.isPending) && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Sil
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
