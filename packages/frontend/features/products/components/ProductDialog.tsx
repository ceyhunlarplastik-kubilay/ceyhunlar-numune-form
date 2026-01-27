"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { useCreateProduct, useUpdateProduct } from "../mutations";
import { uploadProductImage } from "@/features/products/upload";
import { fetchProduct } from "@/features/products/fetchers";

import { useSectors } from "@/hooks/useSectors";
import { useProductAssignments } from "@/hooks/useProductAssignments";

import { AssignmentRow } from "./AssignmentRow";
import type { ProductFormValues } from "../types";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */

interface Props {
    open: boolean;
    productId: string | null;
    onClose: () => void;
}

/* -------------------------------------------------------------------------- */

export function ProductDialog({ open, productId, onClose }: Props) {
    const isEdit = Boolean(productId);
    const fileRef = useRef<HTMLInputElement>(null);

    const [preview, setPreview] = useState<string>("");
    const [uploading, setUploading] = useState(false);

    const form = useForm<ProductFormValues>({
        defaultValues: {
            name: "",
            description: "",
            imageUrl: "",
            assignments: [{ sectorId: "", productionGroupId: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "assignments",
    });

    /* --------------------------- DATA --------------------------- */

    const { data: sectors = [] } = useSectors();

    const { data: assignmentsData } = useProductAssignments(
        productId,
        open
    );

    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();

    /* -------------------- LOAD PRODUCT (EDIT) -------------------- */

    useEffect(() => {
        if (!open) return;

        // CREATE MODE RESET
        if (!productId) {
            form.reset({
                name: "",
                description: "",
                imageUrl: "",
                assignments: [{ sectorId: "", productionGroupId: "" }],
            });
            setPreview("");
            return;
        }

        // EDIT MODE
        (async () => {
            const product = await fetchProduct(productId);
            if (!product) return;

            form.reset({
                name: product.name,
                description: product.description ?? "",
                imageUrl: product.imageUrl ?? "",
                assignments: [{ sectorId: "", productionGroupId: "" }],
            });

            if (product.imageUrl) {
                setPreview(product.imageUrl);
            }
        })();
    }, [open, productId, form]);

    /* -------------------- LOAD ASSIGNMENTS -------------------- */

    useEffect(() => {
        if (!assignmentsData) return;

        const normalized = assignmentsData.assignments.map((a) => ({
            sectorId:
                typeof a.sectorId === "string"
                    ? a.sectorId
                    : a.sectorId._id,
            productionGroupId:
                typeof a.productionGroupId === "string"
                    ? a.productionGroupId
                    : a.productionGroupId._id,
        }));

        form.setValue(
            "assignments",
            normalized.length
                ? normalized
                : [{ sectorId: "", productionGroupId: "" }]
        );
    }, [assignmentsData, form]);

    /* -------------------- FILE -------------------- */

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreview(url);
    };

    const removeImage = () => {
        setPreview("");
        form.setValue("imageUrl", "");
        if (fileRef.current) fileRef.current.value = "";
    };

    /* -------------------- SUBMIT -------------------- */

    const onSubmit = async (values: ProductFormValues) => {
        const validAssignments = values.assignments.filter(
            (a) => a.sectorId && a.productionGroupId
        );
        if (!validAssignments.length) return;

        try {
            // =========================
            // ✏️ EDIT MODE
            // =========================
            if (isEdit && productId) {
                let imageUrl = values.imageUrl;

                if (fileRef.current?.files?.[0]) {
                    setUploading(true);
                    imageUrl = await uploadProductImage(
                        fileRef.current.files[0],
                        productId
                    );
                    setUploading(false);
                }

                await updateMutation.mutateAsync({
                    productId,
                    name: values.name,
                    description: values.description,
                    imageUrl,
                    assignments: validAssignments,
                });

                toast.success("Ürün güncellendi");
                onClose();
                return;
            }

            // =========================
            // ➕ CREATE MODE
            // =========================
            const result = await createMutation.mutateAsync({
                name: values.name,
                description: values.description,
                imageUrl: "",
                assignments: validAssignments,
            });

            const newProductId = result?.product?._id;
            if (!newProductId) {
                toast.error("Product ID alınamadı");
                return;
            }

            let imageUrl = "";
            if (fileRef.current?.files?.[0]) {
                setUploading(true);
                imageUrl = await uploadProductImage(
                    fileRef.current.files[0],
                    newProductId
                );
                setUploading(false);
            }

            if (imageUrl) {
                await updateMutation.mutateAsync({
                    productId: newProductId,
                    name: values.name,
                    description: values.description,
                    imageUrl,
                    assignments: validAssignments,
                });
            }

            toast.success("Ürün oluşturuldu");
            onClose();
        } catch (err) {
            setUploading(false);
            console.error(err);
            toast.error(isEdit ? "Ürün güncellenemedi" : "Ürün oluşturulamadı");
        }
    };



    /* -------------------------------------------------------------------------- */

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Ürün Düzenle" : "Yeni Ürün"}
                    </DialogTitle>
                    <DialogDescription>
                        Ürün bilgilerini ve kategori atamalarını giriniz.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 py-4"
                >
                    {/* IMAGE */}
                    <div className="flex justify-center">
                        <div className="space-y-3 w-full max-w-xs text-center">
                            <Label>Ürün Görseli</Label>

                            {preview ? (
                                <div className="relative aspect-square w-full rounded-xl overflow-hidden border group">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={removeImage}
                                        >
                                            Görseli Kaldır
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="aspect-square w-full rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary transition flex flex-col items-center justify-center cursor-pointer bg-muted/30"
                                >
                                    <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                                    <p className="text-sm font-medium">Görsel Yükle</p>
                                    <p className="text-xs text-muted-foreground">
                                        PNG / JPG
                                    </p>
                                </div>
                            )}

                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onFileSelect}
                            />
                        </div>
                    </div>

                    {/* BASIC */}
                    <div className="space-y-4">
                        <Input
                            placeholder="Ürün adı"
                            {...form.register("name")}
                        />
                        <Textarea
                            placeholder="Açıklama"
                            {...form.register("description")}
                        />
                    </div>

                    <Separator />

                    {/* ASSIGNMENTS */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="font-semibold">
                                Kategori Atamaları
                            </Label>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    append({
                                        sectorId: "",
                                        productionGroupId: "",
                                    })
                                }
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Ekle
                            </Button>
                        </div>

                        {fields.map((f, i) => (
                            <AssignmentRow
                                key={f.id}
                                index={i}
                                sectors={sectors}
                                form={form}
                                canRemove={fields.length > 1}
                                onRemove={() => remove(i)}
                            />
                        ))}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            İptal
                        </Button>
                        <Button type="submit" disabled={uploading}>
                            {uploading && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Kaydet
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
