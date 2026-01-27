"use client";

import {useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/features/products/fetchers";
import type { ProductsResponse } from "@/features/products/types";

interface UseProductsParams {
    search?: string;
    sectorId?: string;
    productionGroupId?: string;
    page: number;
    pageSize?: number;
}

export function useProducts({
    search = "",
    sectorId,
    productionGroupId,
    page,
    pageSize = 20,
}: UseProductsParams) {

    const normalizedSectorId = sectorId ?? "all";
    const normalizedGroupId = productionGroupId ?? "all";

    const query = useQuery<ProductsResponse>({
        queryKey: [
            "products",
            search,
            normalizedSectorId,
            normalizedGroupId,
            page,
            pageSize
        ],
        queryFn: () =>
            fetchProducts({
                search,
                sectorId: normalizedSectorId,
                productionGroupId: normalizedGroupId,
                page,
                limit: pageSize,
            }),
        placeholderData: (prev) => prev,
    });

    return {
        products: query.data?.items ?? [],
        total: query.data?.total ?? 0,
        totalPages: Math.ceil((query.data?.total ?? 0) / pageSize),
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
    };
}
