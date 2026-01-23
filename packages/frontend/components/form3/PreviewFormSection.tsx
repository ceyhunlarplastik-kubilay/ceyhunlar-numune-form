"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Package,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { FormSectionStickyWrapper } from "@/components/form3/form-section/FormSectionStickyWrapper";

export const PreviewFormSection = ({
  form,
  sectors,
  groups,
  products,
}: {
  form: any;
  sectors: Array<{ sectorId: string; name: string }>;
  groups: Array<{ groupId: string; name: string }>;
  products: Array<{ productId: string; name: string }>;
}) => {
  const values = form.getValues();

  const {
    sektor,
    urunler,
    customProducts,
    firmaAdi,
    ad,
    soyad,
    email,
    telefon,
    adres,
    il,
    ilce,
  } = values;

  const isOthers = sektor === "others";

  /* ----------------------------- SEKTÖR ----------------------------- */

  const selectedSector =
    sectors.find((s) => s.sectorId === sektor)?.name ||
    (isOthers ? "Diğerleri" : "—");

  /* ------------------------- NORMAL FLOW ----------------------------- */

  const selectedProductsNormal =
    urunler?.map((item: any) => {
      const product = products.find((p) => p.productId === item.productId);
      const group = groups.find((g) => g.groupId === item.productionGroupId);

      return product
        ? {
            name: product.name,
            groupName: group?.name ?? "—",
          }
        : null;
    }).filter(Boolean) || [];

  /* -------------------------- OTHERS FLOW ---------------------------- */

  const selectedProductsOthers =
    customProducts?.map((item: any) => ({
      name: item.productName,
      groupName: item.productionGroupName,
    })) || [];

  const selectedProducts = isOthers
    ? selectedProductsOthers
    : selectedProductsNormal;

  const selectedGroups = Array.from(
    new Set(selectedProducts.map((p: any) => p.groupName))
  );

  /* ------------------------------------------------------------------ */

  return (
    <FormSectionStickyWrapper
      title="Önizleme ve Onay"
      description="Lütfen bilgilerinizi kontrol edip onaylayınız."
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* --- Talep Detayları --- */}
          <Card className="md:col-span-2 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5 text-primary" />
                Talep Detayları
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {/* Sektör */}
              <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Sektör
                </p>
                <p className="font-medium text-lg">{selectedSector}</p>
              </div>

              {/* Üretim Grupları */}
              <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="w-4 h-4" /> Üretim Grupları
                </p>
                <p className="font-medium text-lg">
                  {selectedGroups.length > 0
                    ? selectedGroups.join(", ")
                    : "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* --- Ürünler --- */}
          <Card className="md:col-span-2 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Seçilen Ürünler ({selectedProducts.length})
              </CardTitle>
            </CardHeader>

            <CardContent>
              {selectedProducts.length > 0 ? (
                <div className="rounded-md border bg-background">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="h-12 px-4 text-left">Ürün Adı</th>
                        <th className="h-12 px-4 text-left">Üretim Grubu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProducts.map((item: any, i: number) => (
                        <tr key={i} className="border-b">
                          <td className="p-4 font-medium">{item.name}</td>
                          <td className="p-4">{item.groupName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground italic p-4 text-center bg-muted/30 rounded-lg">
                  Ürün bilgisi girilmedi.
                </p>
              )}
            </CardContent>
          </Card>

          {/* --- İletişim Bilgileri --- */}
          <Card className="md:col-span-2 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" />
                İletişim Bilgileri
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6 sm:grid-cols-2">
              <Info label="Firma Adı" value={firmaAdi} icon={<Building2 />} />
              <Info
                label="Yetkili Kişi"
                value={`${ad || ""} ${soyad || ""}`.trim() || "—"}
                icon={<User />}
              />
              <Info label="Email" value={email} icon={<Mail />} />
              <Info label="Telefon" value={telefon} icon={<Phone />} />
              <Info label="İl / İlçe" value={`${il} / ${ilce}`} icon={<MapPin />} />
              <Info label="Adres" value={adres || "—"} icon={<MapPin />} full />
            </CardContent>
          </Card>
        </div>
      </div>
    </FormSectionStickyWrapper>
  );
};

/* ------------------------------------------------------------------ */

function Info({
  label,
  value,
  icon,
  full,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`space-y-1 ${full ? "sm:col-span-2" : ""}`}>
      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        {icon} {label}
      </p>
      <p className="font-medium">{value}</p>
      <Separator />
    </div>
  );
}
