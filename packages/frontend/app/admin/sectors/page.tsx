"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AppBreadcrumb } from "@/components/breadcrumbs/AppBreadcrumb";

interface Sector {
  _id: string;
  name: string;
  imageUrl?: string;
}

interface ProductionGroup {
  _id: string;
  name: string;
}

export default function AdminSectorsPage() {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Sector | null>(null);
  const [deleting, setDeleting] = useState<Sector | null>(null);
  const [name, setName] = useState("");

  // IMAGE UPLOAD STATE
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [removeImageFlag, setRemoveImageFlag] = useState(false);

  const [dependentGroups, setDependentGroups] = useState<ProductionGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Clean up preview blob URLs
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  /* -------------------------------------------------------------------------- */
  /*                                    DATA                                    */
  /* -------------------------------------------------------------------------- */

  const { data: sectors = [], isLoading } = useQuery({
    queryKey: ["sectors"],
    queryFn: async () => (await axios.get("/api/sectors")).data,
  });

  /* -------------------------------------------------------------------------- */
  /*                                  MUTATIONS                                 */
  /* -------------------------------------------------------------------------- */

  async function uploadToS3(file: File, sectorId: string): Promise<string> {
    if (!sectorId) throw new Error("sectorId is required for upload");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("sectorId", sectorId);

    const { data } = await axios.post("/api/sectors/upload", fd);
    return data.url;
  }

  async function deleteFromS3ByUrl(url: string) {
    await axios.delete("/api/sectors/upload", {
      params: { url },
    });
  }

  const createMutation = useMutation({
    mutationFn: async () => {
      // 1. Create sector
      const { data: sector } = await axios.post("/api/sectors", {
        name: name.trim(),
      });

      // 2. Upload image if exists
      if (selectedFile) {
        const imageUrl = await uploadToS3(selectedFile, sector._id);

        // 3. Update sector with image
        await axios.put("/api/sectors", {
          id: sector._id,
          name: sector.name,
          imageUrl,
        });
      }

      return sector;
    },
    onSuccess: () => {
      toast.success("Sektör oluşturuldu");
      qc.invalidateQueries({ queryKey: ["sectors"] });
      closeDialog();
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.error || "Oluşturulamadı");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing) throw new Error("Editing sector missing");

      let finalImageUrl = editing.imageUrl || "";

      // 1. Upload new image if selected
      if (selectedFile) {
        finalImageUrl = await uploadToS3(selectedFile, editing._id);
      }

      // 2. Update sector
      await axios.put("/api/sectors", {
        id: editing._id,
        name: name.trim(),
        imageUrl: removeImageFlag ? "" : finalImageUrl,
      });

      // 3. Delete old image if needed
      const shouldDeleteOld =
        originalImageUrl &&
        (removeImageFlag ||
          (finalImageUrl && finalImageUrl !== originalImageUrl));

      if (shouldDeleteOld && originalImageUrl) {
        await deleteFromS3ByUrl(originalImageUrl).catch(() => { });
      }
    },
    onSuccess: () => {
      toast.success("Sektör güncellendi");
      qc.invalidateQueries({ queryKey: ["sectors"] });
      closeDialog();
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.error || "Güncellenemedi");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (sector: Sector) => {
      // 1) S3 görsel sil (varsa)
      if (sector.imageUrl) {
        await deleteFromS3ByUrl(sector.imageUrl).catch(() => { });
      }
      // 2) Sektör sil
      await axios.delete("/api/sectors", { params: { id: sector._id } });
    },
    onSuccess: () => {
      toast.success("Sektör silindi");
      qc.invalidateQueries({ queryKey: ["sectors"] });
      setDeleting(null);
      setDependentGroups([]);
    },
    onError: (e: any) => {
      if (e.response?.data?.details?.action) {
        toast.error(e.response.data.error, {
          description: e.response.data.details.action,
          duration: 5000,
        });
      } else {
        toast.error(e.response?.data?.error || "Silinemedi");
      }
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                  HELPERS                                   */
  /* -------------------------------------------------------------------------- */

  const resetInternalState = () => {
    setName("");
    setSelectedFile(null);
    setPreviewUrl("");
    setOriginalImageUrl(null);
    setRemoveImageFlag(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCreate = () => {
    setEditing(null);
    resetInternalState();
    setIsOpen(true);
  };

  const openEdit = (s: Sector) => {
    setEditing(s);
    setName(s.name);
    setIsOpen(true);

    // Image Setup
    setOriginalImageUrl(s.imageUrl || null);
    setPreviewUrl(s.imageUrl || "");
    setSelectedFile(null);
    setRemoveImageFlag(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeDialog = () => {
    setIsOpen(false);
    setEditing(null);
    resetInternalState();
  };

  const openDelete = async (s: Sector) => {
    setDeleting(s);
    setDependentGroups([]);
    setLoadingGroups(true);

    try {
      const { data } = await axios.get("/api/production-groups", {
        params: { sectorId: s._id },
      });
      setDependentGroups(data || []);
    } catch {
      setDependentGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setRemoveImageFlag(false);
    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
  };

  const removeImageUI = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setRemoveImageFlag(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (editing) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      <AppBreadcrumb
        items={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Sektörler" },
        ]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sektörler</h1>
          <p className="text-muted-foreground mt-1">
            Sektörleri ve kapak görsellerini yönetin.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Sektör Ekle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Sektörler</CardTitle>
          <CardDescription>
            Listelenen toplam sektör: {sectors.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Görsel</TableHead>
                  <TableHead>Sektör Adı</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectors.map((s: Sector) => (
                  <TableRow key={s._id}>
                    <TableCell className="py-2">
                      {s.imageUrl ? (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                          <Image
                            src={s.imageUrl}
                            alt={s.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                          YOK
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEdit(s)}
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openDelete(s)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={isOpen} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Sektör Düzenle" : "Yeni Sektör"}
            </DialogTitle>
            <DialogDescription>Sektör bilgilerini giriniz.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Sektör Adı</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Avize..."
              />
            </div>

            <div className="space-y-3">
              <Label>Kapak Görseli</Label>

              <div className="flex justify-center">
                <div className="space-y-3 w-full max-w-xs text-center">
                  {previewUrl ? (
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden border shadow-sm group">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImageUI}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Görseli Kaldır
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="aspect-square w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-600">
                        Görsel Yükle
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG (Max 5MB)
                      </p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {uploading && (
                    <p className="text-xs text-blue-600 flex items-center justify-center font-medium animate-pulse">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Yükleniyor...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              İptal
            </Button>
            <Button disabled={!name.trim() || uploading} onClick={handleSubmit}>
              {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sektörü Sil</AlertDialogTitle>

            <AlertDialogDescription>
              <strong>{deleting?.name}</strong> sektörü silinecek.
            </AlertDialogDescription>

            <div className="space-y-3 mt-3">
              {loadingGroups && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Üretim grupları kontrol ediliyor...
                </div>
              )}

              {!loadingGroups && dependentGroups.length > 0 && (
                <div className="rounded-md border bg-muted/50 p-3 space-y-2">
                  <p className="text-sm font-medium text-destructive">
                    Bu sektöre bağlı üretim grupları var:
                  </p>

                  <ul className="list-disc pl-5 text-sm">
                    {dependentGroups.map((g) => (
                      <li key={g._id}>{g.name}</li>
                    ))}
                  </ul>

                  <p className="text-xs text-muted-foreground">
                    Bu grupları silmeden sektörü silemezsiniz.
                  </p>
                </div>
              )}
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              disabled={dependentGroups.length > 0}
              className={
                dependentGroups.length > 0
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-destructive hover:bg-destructive/90"
              }
              onClick={() => {
                if (deleting) {
                  deleteMutation.mutate(deleting);
                }
              }}
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
