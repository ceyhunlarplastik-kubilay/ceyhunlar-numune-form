"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCatalogOptionsBySector } from "./fetchers";
import type { CatalogOptionsResponse } from "./types";

export function useCatalogOptionsBySector(sectorId?: string) {
    return useQuery<CatalogOptionsResponse>({
        queryKey: ["catalogOptions", sectorId],
        queryFn: () => fetchCatalogOptionsBySector(sectorId!),
        enabled: !!sectorId && sectorId !== "all" && sectorId !== "others",
        staleTime: 1000 * 60 * 10,
    });
}
