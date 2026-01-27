import type { ProductBase } from "@/models/product.model"

export interface Product extends ProductBase {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface Assignment {
    sectorId: string;
    productionGroupId: string;
}

export interface ProductsResponse {
    items: Product[];
    total: number;
    page: number;
    limit: number;
}

export interface ProductionGroup {
    groupId: string;
    name: string;
}

export interface ProductFormValues {
    name: string;
    description?: string;
    imageUrl?: string;
    assignments: Assignment[];
}
