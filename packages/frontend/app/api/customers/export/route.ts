import { NextResponse } from "next/server";
import { requireAtLeastRole } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Request, Sector, Product, ProductionGroup } from "@/models";
import * as XLSX from "xlsx";

export async function GET(req: Request) {
    const authError = await requireAtLeastRole("admin");
    if (authError) return authError;

    await connectDB();

    const { searchParams } = new URL(req.url);

    const sector = searchParams.get("sector");
    const productionGroup = searchParams.get("productionGroup");
    const province = searchParams.get("province");
    const district = searchParams.get("district");

    const filter: any = {
        ...(province && { province }),
        ...(district && { district }),

        ...(sector &&
            sector !== "all" &&
            sector !== "others" && { sectorId: sector }),

        ...(sector === "others" && { sectorId: null }),

        ...(productionGroup && { productionGroupIds: productionGroup }),
    };


    const items = await Request.find(filter)
        .sort({ createdAt: -1 })
        .lean();

    const rows = await Promise.all(
        items.map(async (req) => {
            const isOthers = req.sectorId === null;

            /* ---------------- Sector ---------------- */
            const sectorDoc = req.sectorId
                ? await Sector.findById(req.sectorId).lean()
                : null;

            const sectorName = sectorDoc?.name || "Diğerleri";

            /* ---------------- Normal flow ---------------- */
            let productionGroupNames = "";
            let productNames = "";

            if (!isOthers) {
                const productIds =
                    req.products?.map((p: any) => p.productId) || [];
                const groupIds =
                    req.products?.map((p: any) => p.productionGroupId) || [];

                const products = await Product.find({
                    _id: { $in: productIds },
                }).lean();

                const groups = await ProductionGroup.find({
                    _id: { $in: groupIds },
                }).lean();

                productionGroupNames = groups.map((g) => g.name).join(", ");
                productNames = products.map((p) => p.name).join(", ");
            }

            /* ---------------- OTHERS flow ---------------- */
            if (isOthers && Array.isArray(req.customProducts)) {
                productionGroupNames = req.customProducts
                    .map((p: any) => p.productionGroupName)
                    .join(", ");

                productNames = req.customProducts
                    .map((p: any) => p.productName)
                    .join(", ");
            }

            return {
                Tarih: new Date(req.createdAt).toLocaleString("tr-TR"),
                Firma: req.companyName,
                Ad: req.firstName || "",
                Soyad: req.lastName || "",
                Email: req.email,
                Telefon: req.phone,
                İl: req.province,
                İlçe: req.district,
                Adres: req.address || "",
                Sektör: sectorName,
                "Üretim Grupları": productionGroupNames,
                Ürünler: productNames,
                Durum: req.status,
            };
        })
    );


    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Müşteriler");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    const now = new Date();

    // YYYY-MM-DD_HH-mm
    const formattedDate = now
        .toISOString()
        .slice(0, 16)
        .replace("T", "_")
        .replace(":", "-");

    return new NextResponse(buffer, {
        headers: {
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="musteriler_${formattedDate}.xlsx"`,
        },
    });

}
