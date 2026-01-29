"use client";

import { Plus } from "lucide-react";
import { AppBreadcrumb } from "@/components/breadcrumbs/AppBreadcrumb";
import { Button } from "@/components/ui/button";

export function AdminSectorsHeader({
    openCreate,
}: {
    openCreate: () => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <header className="space-y-2">
                <h1 className="text-xl font-bold">Sektörleri ve kapak görsellerini yönetin.</h1>
                <AppBreadcrumb
                    items={[
                        { label: "Ana Sayfa", href: "/" },
                        { label: "Admin", href: "/admin" },
                        { label: "Sektörler" },
                    ]}
                />
            </header>

            <Button onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Sektör Ekle
            </Button>
        </div>
    );
}