import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { requireAtLeastRole } from "@/lib/auth";

/**
 * SST otomatik olarak:
 * - region
 * - credentials
 * - role
 * enjekte eder
 */
const s3 = new S3Client({});

function sanitizeFileName(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function getS3KeyFromUrl(url: string) {
    const u = new URL(url);
    return u.pathname.startsWith("/") ? u.pathname.slice(1) : u.pathname;
}

export async function POST(req: Request) {
    const authError = await requireAtLeastRole("admin");
    if (authError) return authError;

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const productId = formData.get("productId") as string | null;
        const oldImageUrl = formData.get("oldImageUrl") as string | null;

        if (!productId || productId === "undefined") {
            return NextResponse.json(
                { error: "valid productId is required" },
                { status: 400 }
            );
        }

        if (!file || !productId) {
            return NextResponse.json(
                { error: "file and productId are required" },
                { status: 400 }
            );
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type" },
                { status: 400 }
            );
        }

        console.log("UPLOAD oldImageUrl:", oldImageUrl);
        if (oldImageUrl && oldImageUrl.includes(`/products/${productId}/`)) {
            try {
                const oldKey = getS3KeyFromUrl(oldImageUrl);
                await s3.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
                        Key: oldKey,
                    })
                );
            } catch (e) {
                console.error("Old image delete failed", e);
            }
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // const safeName = sanitizeFileName(file.name);
        // const key = `products/${productId}/${Date.now()}-${safeName}`;
        // const key = `products/${productId}`;
        const ext = file.type.split("/")[1]; // jpeg | png | webp
        const version = Date.now();

        const key = `products/${productId}/${version}.${ext}`;


        const isPermanent = process.env.STAGE === "prod" || process.env.STAGE === "dev";

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
                Key: key,
                Body: buffer,
                ContentType: file.type,
                CacheControl: isPermanent ? "public, max-age=31536000" : "no-cache",
            })
        );

        // const url = `https://${process.env.NEXT_PUBLIC_BUCKET_NAME!}.s3.amazonaws.com/${key}`;

        const stage = process.env.STAGE;
        const domain = process.env.DOMAIN!;

        /* const url =
            stage === "prod" || stage === "dev"
                ? `https://cdn.${domain}/${key}`
                : `https://${process.env.NEXT_PUBLIC_BUCKET_NAME!}.s3.amazonaws.com/${key}`;
 */
        const url =
            stage === "prod"
                ? `https://cdn.${domain}/${key}`
                : stage === "dev"
                    ? `https://cdn.dev.${domain}/${key}`
                    : `https://${process.env.NEXT_PUBLIC_BUCKET_NAME!}.s3.amazonaws.com/${key}`;


        return NextResponse.json({ url, key });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    const authError = await requireAtLeastRole("admin");
    if (authError) return authError;

    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get("url");

        if (!url) {
            return NextResponse.json(
                { error: "url is required" },
                { status: 400 }
            );
        }

        const key = getS3KeyFromUrl(url);

        await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
                Key: key,
            })
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Delete failed" },
            { status: 500 }
        );
    }
}
