"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

import { Sector } from "@/features/sectors";
import { Button } from "@/components/ui/button";
import { FlippingCard } from "@/components/ui/flipping-card";

interface SectorCardProps {
    sector: Sector;
    onEdit: () => void;
    onDelete: () => void;
}

export function SectorCard({ sector, onEdit, onDelete }: SectorCardProps) {
    return (
        <div className="flex flex-col items-center gap-2">
            {/* FLIP CARD (SADECE GÖRSEL / BACK ACTIONS) */}
            <FlippingCard
                width={260}
                height={260}
                frontContent={<SectorCardFront sector={sector} />}
                backContent={
                    <SectorCardBack
                        sector={sector}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                }
            />

            {/* ACTIONS — MOBIL SADECE */}
            <div className="flex gap-2 md:hidden">
                <Button size="sm" variant="outline" onClick={onEdit}>
                    <Pencil className="w-4 h-4 mr-2 text-blue-600" />
                    Düzenle
                </Button>

                <Button size="sm" variant="destructive" onClick={onDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sil
                </Button>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* FRONT */
/* -------------------------------------------------------------------------- */

function SectorCardFront({ sector }: { sector: Sector }) {
    return (
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
            {sector.imageUrl ? (
                <Image
                    src={`${sector.imageUrl}?v=${sector.updatedAt}`}
                    alt={sector.name}
                    fill
                    className="object-cover"
                    unoptimized
                />
            ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Görsel Yok
                </div>
            )}

            <div className="absolute inset-x-0 bottom-0 bg-black/45 px-3 py-2">
                <h3 className="text-sm font-semibold text-white truncate">
                    {sector.name}
                </h3>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* BACK */
/* -------------------------------------------------------------------------- */

function SectorCardBack({
    sector,
    onEdit,
    onDelete,
}: {
    sector: Sector;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl bg-card">
            <h3 className="text-base font-semibold">{sector.name}</h3>

            <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={onEdit}>
                    <Pencil className="w-4 h-4 mr-2 text-blue-600" />
                    Düzenle
                </Button>

                <Button size="sm" variant="destructive" onClick={onDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sil
                </Button>
            </div>
        </div>
    );
}
