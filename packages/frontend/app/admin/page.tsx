import { redirect } from "next/navigation";
import Link from "next/link";
import { checkRole } from "@/utils/roles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppBreadcrumb } from "@/components/breadcrumbs/AppBreadcrumb";
import {
  AlertCircle,
  LayoutDashboard,
  Package,
  Layers,
  Home,
} from "lucide-react";
import { AdminNavCards } from "./_components/AdminNavCards.client";


export default async function AdminDashboard() {
  // RBAC: enforce admin only
  if (!(await checkRole("admin"))) {
    redirect("/");
  }

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

      {/* Info Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-amber-800">
        <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Silme İşlemi Hakkında Önemli Bilgi</h4>
          <p>
            Veri bütünlüğünü korumak amacıyla silme işlemleri hiyerarşik bir
            sıra izlemelidir:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-1 opacity-90">
            <li>
              Bir <strong>Sektör</strong> silinmeden önce, o sektöre ait tüm
              ürünler ve üretim grupları silinmelidir.
            </li>
            <li>
              Bir <strong>Üretim Grubu</strong> silinmeden önce, o gruba ait tüm
              ürünler silinmelidir.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
