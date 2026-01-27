import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateProduct() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await axios.post("/api/products", payload);
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useUpdateProduct() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await axios.put("/api/products", payload);
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useDeleteProduct() {
    const qc = useQueryClient();

    return useMutation<void, unknown, { productId: string }>({
        mutationFn: async ({ productId }) => {
            await axios.delete("/api/products", {
                params: { productId },
            });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

