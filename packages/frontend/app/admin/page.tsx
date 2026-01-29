import { AppBreadcrumb } from "@/components/breadcrumbs/AppBreadcrumb";
import { AdminNavCards } from "./_components/AdminNavCards.client";

export default async function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <AppBreadcrumb
          items={[{ label: "Ana Sayfa", href: "/" }, { label: "Admin" }]}
        />
        <p className="text-muted-foreground mt-2">
          İçerik yönetim sistemine hoş geldiniz. Buradan sektörleri, üretim
          gruplarını ve ürünleri yönetebilirsiniz.
        </p>
      </div>

      {/* Navigation Grid */}
      <AdminNavCards />
    </div>
  );
}
