import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product, ProductAssignment, AuditLog } from "@/models/index";
import { requireAtLeastRole } from "@/lib/auth";
import { getActorFromSession, buildRequestMeta } from "@/lib/audit";


const s3 = new S3Client({});

function getS3KeyFromUrl(url: string) {
    const u = new URL(url);
    return u.pathname.startsWith("/") ? u.pathname.slice(1) : u.pathname;
}

/* -------------------------------------------------------------------------- */
/*                                    GET                                     */
/* -------------------------------------------------------------------------- */

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const productIdParam = searchParams.get("productId");
        const search = searchParams.get("search");
        const sectorId = searchParams.get("sectorId");
        const productionGroupId = searchParams.get("productionGroupId");

        // 1. If productId param exists, return specific product(s) (existing logic)
        if (productIdParam) {
            const productIds = productIdParam.split(",").map((id) => id.trim());
            if (productIds.length === 1) {
                const product = await Product.findById(productIds[0]).lean();
                if (!product) {
                    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
                }

                // Get assignments for this product
                const assignments = await ProductAssignment.find({
                    productId: productIds[0]
                }).lean();

                return NextResponse.json({
                    ...product,
                    assignments: assignments || []
                });
            }
            const products = await Product.find({ _id: { $in: productIds } }).lean();

            // Get assignments for all products
            const allAssignments = await ProductAssignment.find({
                productId: { $in: productIds }
            }).lean();

            const productsWithAssignments = products.map(p => ({
                ...p,
                assignments: allAssignments.filter((a: any) => a.productId.toString() === p._id.toString()) || []
            }));

            return NextResponse.json(productsWithAssignments);
        }

        // 2. Build Filter Query
        let productIdsFromAssignments: string[] | null = null;

        // If filtering by sector or group, we need to check assignments first
        if (sectorId || productionGroupId) {
            const assignmentQuery: any = {};
            if (sectorId && sectorId !== "all") assignmentQuery.sectorId = sectorId;
            if (productionGroupId && productionGroupId !== "all") assignmentQuery.productionGroupId = productionGroupId;

            const assignments = await ProductAssignment.find(assignmentQuery).select("productId").lean();
            productIdsFromAssignments = assignments.map((a: any) => a.productId.toString());

            // If no assignments found for filter, return empty early
            if (productIdsFromAssignments.length === 0) {
                return NextResponse.json([]);
            }
        }

        // 3. Build Product Query
        const productQuery: any = {};

        // Name search
        if (search) {
            productQuery.name = { $regex: search, $options: "i" };
        }

        // Filter by IDs if assignments restricted them
        if (productIdsFromAssignments !== null) {
            productQuery._id = { $in: productIdsFromAssignments };
        }

        // 4. Fetch Products
        // 4. Pagination
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        const total = await Product.countDocuments(productQuery);
        const products = await Product.find(productQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            items: products,
            total,
            page,
            limit
        });
    } catch (error) {
        console.error("Products API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

/* -------------------------------------------------------------------------- */
/*                                   POST                                     */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
    const authError = await requireAtLeastRole("admin");
    if (authError) return authError;

    try {
        await connectDB();

        const body = await req.json();
        const { name, description, imageUrl, assignments } = body;

        // Validation
        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: "Ürün adı zorunludur" },
                { status: 400 }
            );
        }

        // assignments: [{ sectorId, productionGroupId }]
        if (!assignments || !Array.isArray(assignments) || assignments.length === 0) {
            return NextResponse.json(
                { error: "En az bir sektör ve üretim grubu seçilmelidir" },
                { status: 400 }
            );
        }

        // Check for duplicate product name
        const existingProduct = await Product.findOne({ name: name.trim() });
        if (existingProduct) {
            return NextResponse.json(
                { error: "Bu isimde bir ürün zaten mevcut" },
                { status: 409 }
            );
        }

        // 1) Create Product
        const newProduct = await Product.create({
            name: name.trim(),
            description: description?.trim() || "",
            imageUrl: imageUrl?.trim() || "", // TODO: S3 integration
        });

        // 2) Create ProductAssignments
        const assignmentDocs = assignments.map((a: any) => ({
            productId: newProduct._id,
            productionGroupId: a.productionGroupId,
            sectorId: a.sectorId,
        }));

        await ProductAssignment.insertMany(assignmentDocs);

        // 3️⃣ AUDIT LOG — CREATE
        await AuditLog.create({
            action: "CREATE",
            entity: "Product",
            entityId: newProduct._id.toString(),
            actor: await getActorFromSession(),
            request: buildRequestMeta(req),
            after: {
                product: newProduct.toObject(),
                assignments: assignmentDocs,
            },
        });

        return NextResponse.json(
            { success: true, product: newProduct, assignmentsCreated: assignmentDocs.length },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Product POST Error:", error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Bu ürün zaten mevcut" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

/* -------------------------------------------------------------------------- */
/*                                    PUT                                     */
/* -------------------------------------------------------------------------- */

export async function PUT(req: Request) {
    const authError = await requireAtLeastRole("admin");
    if (authError) return authError;

    try {
        await connectDB();

        const body = await req.json();
        const { productId, name, description, imageUrl, assignments } = body;

        if (!productId) {
            return NextResponse.json(
                { error: "productId zorunludur" },
                { status: 400 }
            );
        }

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { error: "Ürün bulunamadı" },
                { status: 404 }
            );
        }

        const beforeProduct = product.toObject();
        const beforeAssignments = await ProductAssignment.find({ productId }).lean();

        // Update product fields
        if (name !== undefined) product.name = name.trim();
        if (description !== undefined) product.description = description.trim();

        const oldImageUrl = product.imageUrl;
        if (imageUrl !== undefined) {
            const trimmedImageUrl = imageUrl.trim();
            product.imageUrl = trimmedImageUrl;

            // 🧹 S3 CLEANUP (IMAGE REPLACED)
            if (trimmedImageUrl && oldImageUrl && trimmedImageUrl !== oldImageUrl) {
                try {
                    const key = getS3KeyFromUrl(oldImageUrl);
                    await s3.send(
                        new DeleteObjectCommand({
                            Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
                            Key: key,
                        })
                    );
                } catch (err) {
                    console.error("S3 previous image delete failed", err);
                }
            }
        }

        await product.save();
        // 🧹 S3 CLEANUP (IMAGE REMOVED)
        /* if (
            oldImageUrl &&
            (!imageUrl || imageUrl.trim() === "")
        ) {
            try {
                const key = getS3KeyFromUrl(oldImageUrl);
                await s3.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
                        Key: key,
                    })
                );
            } catch (err) {
                console.error("S3 image delete failed", err);
            }
        } */
        if (oldImageUrl && imageUrl && oldImageUrl !== imageUrl) {
            try {
                const key = getS3KeyFromUrl(oldImageUrl);
                await s3.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
                        Key: key,
                    })
                );
            } catch (e) {
                console.error("Old image cleanup failed", e);
            }
        }


        // If assignments are provided, update them
        if (assignments && Array.isArray(assignments)) {
            // Delete existing assignments
            await ProductAssignment.deleteMany({ productId });

            // Create new assignments
            if (assignments.length > 0) {
                const assignmentDocs = assignments.map((a: any) => ({
                    productId: product._id,
                    productionGroupId: a.productionGroupId,
                    sectorId: a.sectorId,
                }));

                await ProductAssignment.insertMany(assignmentDocs);
            }
        }

        const afterProduct = product.toObject();

        const afterAssignments = await ProductAssignment.find({ productId }).lean();
        function normalizeAssignments(list: any[]) {
            return list
                .map(a => `${a.sectorId}:${a.productionGroupId}`)
                .sort();
        }

        await AuditLog.create({
            action: "UPDATE",
            entity: "Product",
            entityId: productId,
            actor: await getActorFromSession(),
            request: buildRequestMeta(req),

            before: {
                product: beforeProduct,
                assignments: beforeAssignments,
            },

            after: {
                product: afterProduct,
                assignments: afterAssignments,
            },

            changes: {
                name: beforeProduct.name !== afterProduct.name
                    ? { from: beforeProduct.name, to: afterProduct.name }
                    : undefined,

                description: beforeProduct.description !== afterProduct.description
                    ? { from: beforeProduct.description, to: afterProduct.description }
                    : undefined,

                imageUrl: beforeProduct.imageUrl !== afterProduct.imageUrl
                    ? { from: beforeProduct.imageUrl, to: afterProduct.imageUrl }
                    : undefined,

                assignments:
                    JSON.stringify(normalizeAssignments(beforeAssignments)) !==
                        JSON.stringify(normalizeAssignments(afterAssignments))
                        ? {
                            from: beforeAssignments,
                            to: afterAssignments,
                        }
                        : undefined,
            },
        });


        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        console.error("Product PUT Error:", error);

        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Bu isimde bir ürün zaten mevcut" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    const authError = await requireAtLeastRole("admin");
    if (authError) return authError;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const product = await Product.findById(productId);
    if (!product) {
        return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // ✅ S3 CLEANUP DOĞRU YER
    if (product.imageUrl) {
        try {
            const key = getS3KeyFromUrl(product.imageUrl);

            await s3.send(
                new DeleteObjectCommand({
                    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
                    Key: key,
                })
            );
        } catch (err) {
            console.error("S3 cleanup failed", err);
            // ❗ ürünü silmeye devam et
        }
    }

    const beforeAssignments = await ProductAssignment.find({ productId }).lean();

    await ProductAssignment.deleteMany({ productId });

    await Product.findByIdAndDelete(productId);

    await AuditLog.create({
        action: "DELETE",
        entity: "Product",
        entityId: productId,
        actor: await getActorFromSession(),
        request: buildRequestMeta(req),
        before: {
            product: product.toObject(),
            assignments: beforeAssignments,
        },
    });

    return NextResponse.json({ success: true });
}

