"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

import { useProducts } from "@/features/products/hooks";
import { useDeleteProduct } from "@/features/products/mutations";
import { ProductsHeader } from "@/features/products/components/ProductsHeader";
import { ProductsFilters } from "@/features/products/components/ProductsFilters"
import { ProductsCard } from "@/features/products/components/ProductsCard";
import { ProductDialog } from "@/features/products/components/ProductDialog";
import { ProductsAlertDialog } from "@/features/products/components/ProductAlertDialog";

import { useSectors } from "@/hooks/useSectors";
import { useProductionGroups } from "@/hooks/useProductionGroups";

import type { Product } from "@/features/products/types";

type DeleteProductPreview = Pick<Product, "_id" | "name">;

/* -------------------------------------------------------------------------- */

export default function AdminProductsPage() {
  /* ----------------------------- UI STATE ----------------------------- */
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  /* ----------------------------- FILTER STATE ----------------------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");

  /* ----------------------------- DATA ----------------------------- */
  const { data: sectors = [] } = useSectors();
  const { data: groups = [] } = useProductionGroups(
    selectedSector !== "all" ? selectedSector : undefined
  );

  const {
    products,
    total,
    totalPages,
    isLoading,
    isFetching,
  } = useProducts({
    search: debouncedSearch,
    sectorId: selectedSector === "all" ? undefined : selectedSector,
    productionGroupId: selectedGroup === "all" ? undefined : selectedGroup,
    page,
  });

  /* ----------------------------- EFFECTS ----------------------------- */
  useEffect(() => {
    setSelectedGroup("all");
    setPage(1);
  }, [selectedSector]);

  /* ----------------------------- DELETE ----------------------------- */
  const deleteMutation = useDeleteProduct();
  const [deletingProduct, setDeletingProduct] = useState<DeleteProductPreview | null>(null);

  /* ----------------------------- HANDLERS ----------------------------- */
  const openCreate = () => {
    setEditingProductId(null);
    setDialogOpen(true);
  };

  const openEdit = (productId: string) => {
    setEditingProductId(productId);
    setDialogOpen(true);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      <ProductsHeader />

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <ProductsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
          sectors={sectors}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          groups={groups}
          setPage={setPage}
        />

        <ProductsCard
          products={products}
          loading={isLoading}
          fetching={isFetching}
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={setPage}
          onEdit={openEdit}
          onDelete={(id) =>
            setDeletingProduct(
              products.find((p) => p._id === id) ?? null
            )
          }
          setDeletingProduct={setDeletingProduct}
          openCreate={openCreate}
        />

      </div>

      <ProductDialog
        open={dialogOpen}
        productId={editingProductId}
        onClose={() => setDialogOpen(false)}
      />

      <ProductsAlertDialog
        deletingProduct={deletingProduct}
        setDeletingProduct={setDeletingProduct}
        deleteMutation={deleteMutation}
      />
    </div>
  );
}
