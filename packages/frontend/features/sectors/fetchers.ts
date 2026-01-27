import axios from "axios";
import type { Sector } from "@/features/sectors/types";

export async function fetchSectors(): Promise<Sector[]> {
    const { data } = await axios.get<Sector[]>("/api/sectors");
    return data;
}
