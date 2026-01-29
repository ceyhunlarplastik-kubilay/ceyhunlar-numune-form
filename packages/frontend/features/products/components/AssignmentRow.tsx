"use client";

import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { useCatalogOptionsBySector } from "@/features/catalog";

import type { ProductFormValues, ProductionGroup } from "../types";

interface Sector {
    _id: string;
    name: string;
}

interface Props {
    index: number;
    sectors: Sector[];
    form: UseFormReturn<ProductFormValues>;
    canRemove: boolean;
    onRemove: () => void;
}

export function AssignmentRow({
    index,
    sectors,
    form,
    canRemove,
    onRemove,
}: Props) {
    const sectorId = form.watch(`assignments.${index}.sectorId`);
    const productionGroupId = form.watch(`assignments.${index}.productionGroupId`);

    const { data } = useCatalogOptionsBySector(sectorId);

    const groups: ProductionGroup[] = useMemo(
        () => data?.groups ?? [],
        [data]
    );

    return (
        <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-lg border bg-muted/30">
            {/* SECTOR */}
            <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Sektör</Label>
                <Controller
                    control={form.control}
                    name={`assignments.${index}.sectorId`}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onValueChange={(val) => {
                                field.onChange(val);
                                form.setValue(
                                    `assignments.${index}.productionGroupId`,
                                    ""
                                );
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sektör seç" />
                            </SelectTrigger>
                            <SelectContent>
                                {sectors.map((s) => (
                                    <SelectItem key={s._id} value={s._id}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* GROUP */}
            <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Üretim Grubu</Label>

                <Controller
                    control={form.control}
                    name={`assignments.${index}.productionGroupId`}
                    render={({ field }) => (
                        <Select
                            value={field.value || ""}
                            onValueChange={field.onChange}
                            disabled={!sectorId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Grup seç" />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map((g) => (
                                    <SelectItem key={g.groupId} value={g.groupId}>
                                        {g.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {canRemove && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive self-end"
                    onClick={onRemove}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
