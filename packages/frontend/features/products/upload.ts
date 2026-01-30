import axios from "axios";

/* -------------------------------------------------------------------------- */
/* UPLOAD IMAGE                                                               */
/* -------------------------------------------------------------------------- */

export async function uploadProductImage(
    file: File,
    productId: string,
    oldImageUrl?: string
): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId);
    if (oldImageUrl) {
        formData.append("oldImageUrl", oldImageUrl);
    }

    const { data } = await axios.post("/api/products/upload", formData);
    return data.url;
}

/* -------------------------------------------------------------------------- */
/* DELETE IMAGE                                                               */
/* -------------------------------------------------------------------------- */

export async function deleteProductImage(imageUrl: string): Promise<void> {
    await axios.delete("/api/products/upload", {
        params: { url: imageUrl },
    });
}
