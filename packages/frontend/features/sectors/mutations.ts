"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import type { Sector } from "@/features/sectors";

async function uploadToS3(file: File, sectorId: string) {
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

export function useCreateSector() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({
            name,
            file,
        }: {
            name: string;
            file?: File | null;
        }) => {
            const { data: sector } = await axios.post("/api/sectors", { name });

            if (file) {
                const imageUrl = await uploadToS3(file, sector._id);
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
        },
    });
}

export function useUpdateSector({
    editing,
    name,
    selectedFile,
    removeImageFlag,
    originalImageUrl,
    closeDialog
}: {
    editing: Sector | null;
    name: string;
    selectedFile: File | null;
    removeImageFlag: boolean;
    originalImageUrl: string | undefined;
    closeDialog: () => void;
}) {
    const qc = useQueryClient();

    return useMutation({
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
}
