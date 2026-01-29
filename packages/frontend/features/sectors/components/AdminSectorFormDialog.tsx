"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";

import { Sector, useCreateSector, useUpdateSector } from "@/features/sectors";

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

interface AdminSectorFormDialogProps {
    open: boolean;
    editing: Sector | null;
    onClose: () => void;
}

export function AdminSectorFormDialog({
    open,
    editing,
    onClose,
}: AdminSectorFormDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [removeImageFlag, setRemoveImageFlag] = useState(false);

    /* -------------------------------------------------------------------------- */
    /* EFFECTS                                                                    */
    /* -------------------------------------------------------------------------- */

    useEffect(() => {
        if (!editing) {
            setName("");
            setPreviewUrl("");
            setSelectedFile(null);
            setOriginalImageUrl(null);
            setRemoveImageFlag(false);
            return;
        }

        setName(editing.name);
        setOriginalImageUrl(editing.imageUrl || null);
        setPreviewUrl(
            editing.imageUrl
                ? `${editing.imageUrl}?v=${editing.updatedAt || Date.now()}`
                : ""
        );
    }, [editing]);

    useEffect(() => {
        return () => {
            if (previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    /* -------------------------------------------------------------------------- */
    /* MUTATIONS                                                                  */
    /* -------------------------------------------------------------------------- */

    const createMutation = useCreateSector();

    const updateMutation = useUpdateSector({
        editing,
        name,
        selectedFile,
        removeImageFlag,
        originalImageUrl: originalImageUrl || undefined,
        closeDialog: onClose,
    });

    /* -------------------------------------------------------------------------- */
    /* HANDLERS                                                                   */
    /* -------------------------------------------------------------------------- */

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setRemoveImageFlag(false);
        setPreviewUrl(URL.createObjectURL(file));
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
            createMutation.mutate({ name, file: selectedFile });
            onClose();
        }
    };

    /* -------------------------------------------------------------------------- */
    /* RENDER                                                                     */
    /* -------------------------------------------------------------------------- */

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editing ? "Sektör Düzenle" : "Yeni Sektör"}
                    </DialogTitle>
                    <DialogDescription>
                        Sektör bilgilerini giriniz.
                    </DialogDescription>
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
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        İptal
                    </Button>
                    <Button
                        disabled={!name.trim() || updateMutation.isPending}
                        onClick={handleSubmit}
                    >
                        {(createMutation.isPending || updateMutation.isPending) && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        {editing ? "Güncelle" : "Oluştur"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
