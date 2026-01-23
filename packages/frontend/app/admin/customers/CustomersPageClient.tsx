"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import StickyColumnsTable, {
  Customer,
} from "@/components/customized/table/table-07";
import { CustomersPagination } from "@/components/customers/CustomersPagination";
// import { CustomersTableSkeleton } from "@/components/customers/CustomersTableSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { AppBreadcrumb } from "@/components/breadcrumbs/AppBreadcrumb";
import { ExportCustomersDialog } from "@/components/customers/ExportCustomersDialog";

import { useProvinces } from "@/hooks/useProvinces";
import { useDistricts } from "@/hooks/useDistricts";
import { useSectors } from "@/hooks/useSectors";
import { useProductionGroups } from "@/hooks/useProductionGroups";
import { Loader2, FileSpreadsheet } from "lucide-react";

/* -------------------------------------------------------------------------- */

interface PaginatedResponse {
  customers: Customer[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/* -------------------------------------------------------------------------- */

async function fetchCustomers(
  page: number,
  search: string,
  sector: string,
  group: string,
  product: string,
  province: string,
  district: string
): Promise<PaginatedResponse> {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  else params.set("page", String(page));

  if (sector) params.set("sector", sector);
  if (group) params.set("productionGroup", group);
  if (product) params.set("product", product);
  if (province) params.set("province", province);
  if (district) params.set("district", district);

  const res = await fetch(`/api/customers?${params.toString()}`);
  if (!res.ok) throw new Error("Müşteriler alınamadı");
  return res.json();
}

/* -------------------------------------------------------------------------- */

export default function CustomersPageClient() {
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams?.get("page")) || 1;

  const [page, setPage] = useState(initialPage);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );

  const [sector, setSector] = useState("");
  const [productionGroup, setProductionGroup] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");

  const [exportOpen, setExportOpen] = useState(false);

  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: [
      "customers",
      page,
      debouncedSearch,
      sector,
      productionGroup,
      province,
      district,
    ],
    queryFn: () =>
      fetchCustomers(
        page,
        debouncedSearch,
        sector,
        productionGroup,
        "",
        province,
        district
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/customers?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silinemedi");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Kayıt silindi");
      setCustomerToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => toast.error("Silme başarısız"),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch("/api/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Durum güncellenemedi");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Durum güncellendi");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  const { data: provinces = [] } = useProvinces();
  const { data: districts = [] } = useDistricts(province);
  const { data: sectors = [] } = useSectors();
  const { data: productionGroups = [] } = useProductionGroups(sector);

  const selectedSectorName =
    sector === "others"
      ? "Diğerleri"
      : sectors.find((s) => s._id === sector)?.name;

  const selectedProductionGroupName =
    productionGroups.find((pg) => pg._id === productionGroup)?.name;


  /* 🔥 Filtre değişince her zaman 1. sayfaya dön */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sector, productionGroup, province, district]);

  return (
    <>
      {/* HEADER */}
      <header className="py-4 border-b mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Sol taraf: Title + Breadcrumb */}
          <div className="space-y-1">
            <h1 className="text-xl font-bold">Müşteriler</h1>
            <AppBreadcrumb
              items={[
                { label: "Ana Sayfa", href: "/" },
                { label: "Admin", href: "/admin" },
                { label: "Müşteriler" },
              ]}
            />
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setExportOpen(true)}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-white" />
            Excel Export
          </Button>

          <ExportCustomersDialog
            open={exportOpen}
            onOpenChange={setExportOpen}
            filters={{
              sector: sector
                ? { id: sector, label: selectedSectorName }
                : undefined,
              productionGroup: productionGroup
                ? { id: productionGroup, label: selectedProductionGroupName }
                : undefined,
              province,
              district,
            }}
          />
        </div>
      </header>

      {/* LAYOUT - Fixed Height Container */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 h-[calc(100vh-140px)]">
        {/* ASIDE – FILTERS */}
        <aside className="space-y-6 overflow-y-auto pr-2">
          {/* SEARCH */}
          <div className="space-y-2">
            <Input
              placeholder="Müşteri ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => customersQuery.refetch()}
            >
              Yenile
            </Button>
          </div>

          {/* FILTER CARD */}
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Filtreler
            </h3>

            {/* Sector */}
            <Select
              value={sector}
              onValueChange={(val) => {
                setSector(val);
                setProductionGroup("");
              }}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Sektör" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                {sectors.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name}
                  </SelectItem>
                ))}
                <SelectItem value="others">Diğerleri</SelectItem>
              </SelectContent>
            </Select>

            {/* Production Group */}
            <Select
              value={productionGroup}
              onValueChange={setProductionGroup}
              disabled={!sector || sector === "others"}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue
                  placeholder={
                    sector === "others"
                      ? "Diğerleri için üretim grubu yok"
                      : "Üretim Grubu"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {productionGroups.map((pg) => (
                  <SelectItem key={pg._id} value={pg._id}>
                    {pg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Province */}
            <Select
              value={province}
              onValueChange={(val) => {
                setProvince(val);
                setDistrict("");
              }}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="İl" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((p) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* District */}
            <Select
              value={district}
              onValueChange={setDistrict}
              disabled={!province}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue
                  placeholder={province ? "İlçe" : "Önce il seçiniz"}
                />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d.id} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* CLEAR */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearch("");
                setSector("");
                setProductionGroup("");
                setProvince("");
                setDistrict("");
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        </aside>

        {/* MAIN – TABLE */}
        <main className="flex flex-col h-full overflow-hidden gap-4">
          <section className="flex-1 border rounded-lg overflow-hidden bg-card relative">
            <div className="absolute inset-0 overflow-auto">
              {/* Loader2 yerine kullanılabilir */}
              {/* <CustomersTableSkeleton/>*/}
              {customersQuery.isLoading ? (
                <div className="flex flex-col items-center justify-center h-full bg-white">
                  <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Müşteriler yükleniyor...
                  </p>
                </div>
              ) : (
                <StickyColumnsTable
                  customers={customersQuery.data?.customers || []}
                  onDelete={(c) => setCustomerToDelete(c)}
                  onStatusUpdate={(id, status) =>
                    statusMutation.mutate({ id, status })
                  }
                />
              )}
            </div>
          </section>

          {customersQuery.data?.pagination && !debouncedSearch && (
            <CustomersPagination
              page={page}
              setPage={setPage}
              data={customersQuery.data}
            />
          )}
        </main>
      </div >

      {/* DELETE DIALOG */}
      < AlertDialog
        open={!!customerToDelete
        }
        onOpenChange={() => setCustomerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              <b>{customerToDelete?.companyName}</b> silinecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(customerToDelete!.mongoId)}
              >
                Sil
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog >
    </>
  );
}
