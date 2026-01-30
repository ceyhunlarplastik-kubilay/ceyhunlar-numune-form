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

interface AdminAuditLogsFiltersProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;

    action: string;
    setAction: (val: string) => void;

    entity: string;
    setEntity: (val: string) => void;

    setPage: (val: number) => void;
}

export function AdminAuditLogsFilters({
    searchTerm,
    setSearchTerm,
    action,
    setAction,
    entity,
    setEntity,
    setPage,
}: AdminAuditLogsFiltersProps) {
    return (
        <aside>
            <Card>
                <CardContent className="p-4 space-y-4">
                    {/* SEARCH */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Kayıt, kullanıcı veya endpoint ara..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* ACTION */}
                    <Select
                        value={action}
                        onValueChange={(val) => {
                            setAction(val);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="İşlem Türü" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm İşlemler</SelectItem>
                            <SelectItem value="CREATE">CREATE</SelectItem>
                            <SelectItem value="UPDATE">UPDATE</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* ENTITY */}
                    <Select
                        value={entity}
                        onValueChange={(val) => {
                            setEntity(val);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Varlık Türü" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Varlıklar</SelectItem>
                            <SelectItem value="Sector">Sector</SelectItem>
                            <SelectItem value="ProductionGroup">ProductionGroup</SelectItem>
                            <SelectItem value="Product">Product</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* CLEAR */}
                    {(searchTerm || action !== "all" || entity !== "all") && (
                        <Button
                            variant="ghost"
                            className="justify-start text-muted-foreground"
                            onClick={() => {
                                setSearchTerm("");
                                setAction("all");
                                setEntity("all");
                                setPage(1);
                            }}
                        >
                            Filtreleri Temizle
                        </Button>
                    )}
                </CardContent>
            </Card>
        </aside>
    );
}
