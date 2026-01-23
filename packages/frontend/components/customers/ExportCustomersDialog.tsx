"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";

interface FilterWithLabel {
    id: string;
    label?: string;
}

interface ExportCustomersDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    filters: {
        sector?: FilterWithLabel;
        productionGroup?: FilterWithLabel;
        province?: string;
        district?: string;
    };
}

export function ExportCustomersDialog({
    open,
    onOpenChange,
    filters,
}: ExportCustomersDialogProps) {
    const hasAnyFilter = Object.values(filters).some(
        (v) => v && (typeof v === "string" || v.id)
    );


    const handleExport = () => {
        const params = new URLSearchParams();

        if (filters.sector) params.set("sector", filters.sector.id);
        if (filters.productionGroup)
            params.set("productionGroup", filters.productionGroup.id);
        if (filters.province) params.set("province", filters.province);
        if (filters.district) params.set("district", filters.district);

        window.location.href = `/api/customers/export?${params.toString()}`;
        onOpenChange(false);
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Müşteri bilgilerini Excel'e Aktar</DialogTitle>
                    <DialogDescription>
                        Seçtiğiniz filtrelere göre müşteriler Excel dosyasına aktarılacaktır.
                    </DialogDescription>
                </DialogHeader>

                {/* PREVIEW */}
                <div className="rounded-md border bg-muted/40 p-4 text-sm space-y-2">
                    {hasAnyFilter ? (
                        <>
                            {filters.sector && (
                                <PreviewRow
                                    label="Sektör"
                                    value={filters.sector.label || "Diğerleri"}
                                />
                            )}

                            {filters.productionGroup && (
                                <PreviewRow
                                    label="Üretim Grubu"
                                    value={filters.productionGroup.label || "-"}
                                />
                            )}

                            {filters.province && (
                                <PreviewRow label="İl" value={filters.province} />
                            )}
                            {filters.district && (
                                <PreviewRow label="İlçe" value={filters.district} />
                            )}
                        </>
                    ) : (
                        <p className="text-muted-foreground">
                            Herhangi bir filtre seçilmedi.
                            <br />
                            <strong>Tüm müşteriler export edilecek.</strong>
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Vazgeç
                    </Button>

                    <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleExport}
                    >
                        <FileSpreadsheet className="w-4 h-4 mr-2 text-white" />
                        Excel’i İndir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-right truncate">{value}</span>
        </div>
    );
}
