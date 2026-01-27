import axios from "axios";
import type { CatalogOptionsResponse } from "./types";

export async function fetchCatalogOptionsBySector(
    sectorId: string
): Promise<CatalogOptionsResponse> {
    const { data } = await axios.get<CatalogOptionsResponse>(
        "/api/catalog/options",
        { params: { sectorId } }
    );

    return data;
}
