"use client";

import { AppBreadcrumb } from "@/components/breadcrumbs/AppBreadcrumb";

export function ProductsHeader() {
    return (
        <header className="space-y-2">
            <h1 className="text-xl font-bold">Endüstriyel Ürün Yönetimi</h1>
            <AppBreadcrumb
                items={[
                    { label: "Ana Sayfa", href: "/" },
                    { label: "Admin", href: "/admin" },
                    { label: "Ürünler" },
                ]}
            />
        </header>
    );
}