
import { Resource } from "sst";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const s3 = new S3Client({});

function sanitizeFileName(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function getS3KeyFromUrl(url: string) {
    const u = new URL(url);
    return u.pathname.startsWith("/") ? u.pathname.slice(1) : u.pathname;
}

export async function POST(req: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const sectorId = formData.get("sectorId") as string | null;

        if (!file || !sectorId) {
            return NextResponse.json(
                { error: "file and sectorId are required" },
                { status: 400 }
            );
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const safeName = sanitizeFileName(file.name);
        // const key = `sectors/${sectorId}/${Date.now()}-${safeName}`;
        const key = `sectors/${sectorId}`;

        await s3.send(
            new PutObjectCommand({
                // Bucket: Resource.NumuneFormBucket.name,
                Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
                Key: key,
                Body: buffer,
                ContentType: file.type,
                CacheControl: "public, max-age=31536000",
            })
        );

        // const url = `https://${Resource.NumuneFormBucket.name}.s3.amazonaws.com/${key}`;

        const stage = process.env.STAGE;
        const domain = process.env.DOMAIN!;

        const url =
            stage === "prod" || stage === "dev"
                ? `https://cdn.${domain}/${key}`
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
    const authError = await requireAdmin();
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
                // Bucket: Resource.NumuneFormBucket.name,
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
