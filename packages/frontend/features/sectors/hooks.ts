"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSectors } from "@/features/sectors/fetchers";
import type { Sector } from "@/features/sectors/types";

export function useSectors() {
    return useQuery<Sector[]>({
        queryKey: ["sectors"],
        queryFn: () => fetchSectors(),
    });
}
