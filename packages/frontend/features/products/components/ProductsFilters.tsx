"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProductsFiltersProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    selectedSector: string;
    setSelectedSector: (val: string) => void;
    sectors: { _id: string; name: string }[];
    selectedGroup: string;
    setSelectedGroup: (val: string) => void;
    groups: { _id: string; name: string }[];
    setPage: (val: number) => void;
}

export function ProductsFilters({
    searchTerm,
    setSearchTerm,
    selectedSector,
    setSelectedSector,
    sectors,
    selectedGroup,
    setSelectedGroup,
    groups,
    setPage
}: ProductsFiltersProps) {
    return (
        <aside>
            <Card>
                <CardContent className="p-4 space-y-4">
                    {/* SEARCH */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Ürün adı ara..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* SECTOR */}
                    <Select
                        value={selectedSector}
                        onValueChange={(val) => {
                            setSelectedSector(val);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sektör Seç" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Sektörler</SelectItem>
                            {sectors.map((s) => (
                                <SelectItem key={s._id} value={s._id}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* GROUP */}
                    <Select
                        value={selectedGroup}
                        onValueChange={(val) => {
                            setSelectedGroup(val);
                            setPage(1);
                        }}
                        disabled={selectedSector === "all"}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Üretim Grubu Seç" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Gruplar</SelectItem>
                            {groups.map((g) => (
                                <SelectItem key={g._id} value={g._id}>
                                    {g.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* CLEAR */}
                    {(searchTerm ||
                        selectedSector !== "all" ||
                        selectedGroup !== "all") && (
                            <Button
                                variant="ghost"
                                className="justify-start text-muted-foreground"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedSector("all");
                                    setSelectedGroup("all");
                                    setPage(1);
                                }}
                            >
                                Filtreleri Temizle
                            </Button>
                        )}
                </CardContent>
            </Card>
        </aside>
    )
}