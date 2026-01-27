"use client";

import { useQuery } from "@tanstack/react-query";

export interface ProductAssignment {
    sectorId: { _id: string } | string;
    productionGroupId: { _id: string } | string;
}

interface Response {
    assignments: ProductAssignment[];
}

export function useProductAssignments(
    productId?: string | null,
    enabled = true
) {
    return useQuery({
        queryKey: ["product-assignments", productId],
        queryFn: async (): Promise<Response> => {
            if (!productId) {
                return { assignments: [] };
            }

            const res = await fetch(
                `/api/productAssignments?productId=${productId}`
            );

            if (!res.ok) {
                throw new Error("Ürün atamaları alınamadı");
            }

            return res.json();
        },
        enabled: !!productId && enabled,
        staleTime: 1000 * 60 * 5,
    });
}
