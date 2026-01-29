"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

import { useProducts } from "@/features/products/hooks";
import { useDeleteProduct } from "@/features/products/mutations";

import { AdminProductsHeader } from "@/features/products/components/AdminProductsHeader";
import { AdminProductsFilters } from "@/features/products/components/AdminProductsFilters"
import { AdminProductsCard } from "@/features/products/components/AdminProductsCard";
import { AdminProductDialog } from "@/features/products/components/AdminProductDialog";
import { AdminProductsAlertDialog } from "@/features/products/components/AdminProductAlertDialog";

import { AdminPageGuard } from "@/components/auth/AdminPageGuard";

import { useSectors } from "@/hooks/useSectors";
import { useProductionGroups } from "@/hooks/useProductionGroups";

import type { Product } from "@/features/products/types";

export default function AdminSectorsPage() {
  return (
    <AdminPageGuard requiredRole="admin">
      <ProductsContent />
    </AdminPageGuard>
  );
}

type DeleteProductPreview = Pick<Product, "_id" | "name">;

/* -------------------------------------------------------------------------- */

function ProductsContent() {
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
      <AdminProductsHeader />

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <AdminProductsFilters
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

        <AdminProductsCard
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

      <AdminProductDialog
        key={editingProductId ?? "create"}
        open={dialogOpen}
        productId={editingProductId}
        onClose={() => setDialogOpen(false)}
      />

      <AdminProductsAlertDialog
        deletingProduct={deletingProduct}
        setDeletingProduct={setDeletingProduct}
        deleteMutation={deleteMutation}
      />
    </div>
  );
}
