export interface CatalogProduct {
  productId: string;
  name: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogGroup {
    groupId: string;
    name: string;
    products: CatalogProduct[];
}

export interface CatalogOptionsResponse {
    sectorId: string;
    sectorName: string;
    groups: CatalogGroup[];
}
