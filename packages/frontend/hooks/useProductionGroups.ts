"use client";

import { useQuery } from "@tanstack/react-query";

interface ProductionGroup {
    _id: string;
    name: string;
    sectorId: {
        _id: string;
        name: string;
    };
}

export function useProductionGroups(sectorId?: string) {
    const enabled =
        !!sectorId &&
        sectorId !== "all" &&
        sectorId !== "others";

    return useQuery({
        queryKey: ["production-groups", sectorId],
        queryFn: async (): Promise<ProductionGroup[]> => {
            const params = new URLSearchParams();

            if (sectorId) {
                params.append("sectorId", sectorId);
            }

            const res = await fetch(
                `/api/production-groups?${params.toString()}`
            );
            if (!res.ok) throw new Error("Üretim grupları alınamadı");
            return res.json();
        },
        enabled, // 🔥 SADECE BURASI DEĞİŞTİ
        staleTime: 1000 * 60 * 5, // 5 dakika
    });
}
