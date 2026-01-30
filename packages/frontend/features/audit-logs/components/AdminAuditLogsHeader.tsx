"use client";

import { AppBreadcrumb } from "@/components/breadcrumbs/AppBreadcrumb";
import { ShieldCheck } from "lucide-react";

export function AdminAuditLogsHeader() {
    return (
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur space-y-3 pb-4">
            {/* ÜST SATIR – küçük context */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <span>Sistem Denetimi</span>
            </div>

            {/* ANA BAŞLIK */}
            <h1 className="text-2xl font-semibold tracking-tight">
                İşlem Kayıtları
            </h1>

            {/* AÇIKLAMA */}
            <p className="text-sm text-muted-foreground max-w-2xl">
                Admin kullanıcıların sistem üzerinde yaptığı oluşturma, güncelleme
                ve silme işlemlerinin zaman damgalı kayıtlarını görüntülersin.
            </p>

            {/* BREADCRUMB – daha geri planda */}
            <div className="pt-1">
                <AppBreadcrumb
                    items={[
                        { label: "Ana Sayfa", href: "/" },
                        { label: "Admin", href: "/admin" },
                        { label: "Audit Log" },
                    ]}
                />
            </div>
            <div className="border-b pb-4" />
        </header>
    );
}
