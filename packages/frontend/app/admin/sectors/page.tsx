"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { useSectors, Sector } from "@/features/sectors";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { AdminSectorsHeader } from "@/features/sectors/components/AdminSectorsHeader";
import { SectorCard } from "@/features/sectors/components/SectorCard";
import { AdminSectorFormDialog } from "@/features/sectors/components/AdminSectorFormDialog";
import { AdminSectorDeleteDialog } from "@/features/sectors/components/AdminSectorDeleteDialog";

import { AdminPageGuard } from "@/components/auth/AdminPageGuard";


export default function AdminSectorsPage() {
  return (
    <AdminPageGuard requiredRole="admin">
      <SectorsContent />
    </AdminPageGuard>
  );
}

function SectorsContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Sector | null>(null);
  const [deleting, setDeleting] = useState<Sector | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                                    DATA                                    */
  /* -------------------------------------------------------------------------- */

  const { data: sectors = [], isLoading } = useSectors();

  /* -------------------------------------------------------------------------- */
  /*                                  HELPERS                                   */
  /* -------------------------------------------------------------------------- */

  const openCreate = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (sector: Sector) => {
    setEditing(sector);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setEditing(null);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      <AdminSectorsHeader openCreate={openCreate} />

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Sektörler</CardTitle>
          <CardDescription>
            Listelenen toplam sektör: {sectors.length}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {sectors.map((sector) => (
                <SectorCard
                  key={sector._id}
                  sector={sector}
                  onEdit={() => openEdit(sector)}
                  onDelete={() => setDeleting(sector)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CREATE / EDIT */}
      <AdminSectorFormDialog
        open={isOpen}
        editing={editing}
        onClose={closeDialog}
      />


      {/* DELETE */}
      <AdminSectorDeleteDialog
        sector={deleting}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
