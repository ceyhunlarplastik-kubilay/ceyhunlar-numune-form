"use client";

import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export interface BreadcrumbItemType {
    label: string;
    href?: string;
}

interface AppBreadcrumbProps {
    items: BreadcrumbItemType[];
}

export function AppBreadcrumb({ items }: AppBreadcrumbProps) {
    if (!items?.length) return null;

    const lastIndex = items.length - 1;

    return (
        <Breadcrumb>
            <BreadcrumbList className="text-sm sm:text-base">
                {items.map((item, index) => {
                    const isLast = index === lastIndex;

                    const itemClasses =
                        "px-2 py-0.5 rounded-md border border-border bg-muted/50";

                    return (
                        <span
                            key={`${item.label}-${index}`}
                            className="flex items-center gap-1"
                        >
                            <BreadcrumbItem>
                                {item.href && !isLast ? (
                                    <BreadcrumbLink asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                itemClasses,
                                                "hover:bg-[var(--color-brand)/10] hover:text-foreground transition-colors"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage
                                        className={cn(
                                            itemClasses,
                                            "bg-(--color-brand) text-(--color-brand-foreground) font-medium",
                                            "ring-1 ring-primary/30"
                                        )}
                                    >
                                        {item.label}
                                    </BreadcrumbPage>

                                )}
                            </BreadcrumbItem>

                            {!isLast && <BreadcrumbSeparator />}
                        </span>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
