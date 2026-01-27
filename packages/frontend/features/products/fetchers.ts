import axios from "axios";
import { ProductsResponse } from "@/features/products/types";

export async function fetchProducts(params: {
    search: string;
    sectorId: string;
    productionGroupId: string;
    page: number;
    limit: number;
}): Promise<ProductsResponse> {
    const query: any = { page: params.page, limit: params.limit };

    if (params.search) query.search = params.search;
    if (params.sectorId !== "all") query.sectorId = params.sectorId;
    if (params.productionGroupId !== "all")
        query.productionGroupId = params.productionGroupId;

    const { data } = await axios.get("/api/products", { params: query });
    return data;
}

export async function fetchProduct(productId: string) {
    const { data } = await axios.get("/api/products", {
        params: { productId },
    });

    // backend {product} sarmıyorsa direkt objeyi al
    if (data && data._id) {
        return data;
    }

    // ileride backend düzelirse uyumlu kalsın
    if (data?.product) {
        return data.product;
    }

    throw new Error("Product response invalid");
}
