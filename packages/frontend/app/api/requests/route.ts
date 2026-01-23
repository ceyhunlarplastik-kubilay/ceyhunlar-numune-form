import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import {
    Request,
    ProductAssignment,
    Sector,
    Product,
    ProductionGroup,
} from "@/models";
import { getGoogleSheets } from "@/lib/googleSheets";
import SampleRequestEmail from "@/emails/SampleRequestEmail";
import { sendMail } from "@/lib/mail/sendEmail";
import { render } from "@react-email/components";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const {
            companyName,
            firstName,
            lastName,
            email,
            phone,
            province,
            district,
            address,
            sectorId,          // null => others
            products = [],     // normal flow
            customProducts = [] // others flow
        } = body;

        const isOthers = sectorId === null;

        /* ------------------------------------------------------------------ */
        /* Basic validation                                                    */
        /* ------------------------------------------------------------------ */

        if (!companyName || !email || !phone || !province || !district) {
            return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
        }

        if (isOthers && customProducts.length === 0) {
            return NextResponse.json(
                { error: "En az bir özel ürün girilmelidir" },
                { status: 400 }
            );
        }

        if (!isOthers && products.length === 0) {
            return NextResponse.json(
                { error: "Lütfen en az bir ürün seçiniz" },
                { status: 400 }
            );
        }

        /* ------------------------------------------------------------------ */
        /* NORMAL FLOW: ProductAssignment doğrulaması                           */
        /* ------------------------------------------------------------------ */

        if (!isOthers) {
            for (const item of products) {
                const match = await ProductAssignment.findOne({
                    productId: item.productId,
                    productionGroupId: item.productionGroupId,
                    ...(sectorId && { sectorId }),
                });

                if (!match) {
                    return NextResponse.json(
                        { error: "Ürün / üretim grubu eşleşmesi hatalı" },
                        { status: 400 }
                    );
                }
            }
        }

        /* ------------------------------------------------------------------ */
        /* NORMAL FLOW: Snapshot                                               */
        /* ------------------------------------------------------------------ */

        let snapshotProducts: any[] = [];
        let productionGroupIds: any[] = [];

        if (!isOthers) {
            const productIds = products.map((p: any) => p.productId);
            const groupIds = products.map((p: any) => p.productionGroupId);

            productionGroupIds = [...new Set(groupIds)];

            const productDocs = await Product.find({ _id: { $in: productIds } })
                .select("_id name")
                .lean();

            const groupDocs = await ProductionGroup.find({ _id: { $in: groupIds } })
                .select("_id name")
                .lean();

            const productMap = new Map(
                productDocs.map((p) => [p._id.toString(), p])
            );

            const groupMap = new Map(
                groupDocs.map((g) => [g._id.toString(), g])
            );

            snapshotProducts = products.map((item: any) => {
                const product = productMap.get(item.productId);
                const group = groupMap.get(item.productionGroupId);

                if (!product || !group) {
                    throw new Error("Ürün veya üretim grubu bulunamadı");
                }

                return {
                    productId: product._id,
                    productName: product.name,
                    productionGroupId: group._id,
                    productionGroupName: group.name,
                };
            });
        }

        /* ------------------------------------------------------------------ */
        /* Request oluştur                                                     */
        /* ------------------------------------------------------------------ */

        const newRequest = await Request.create({
            companyName,
            firstName,
            lastName,
            email,
            phone,
            province,
            district,
            address,
            sectorId: isOthers ? null : sectorId,
            productionGroupIds: isOthers ? [] : productionGroupIds,
            products: isOthers ? [] : snapshotProducts,
            customProducts: isOthers ? customProducts : [],
            status: "pending",
            statusHistory: [
                {
                    status: "pending",
                    note: "Talep oluşturuldu",
                    timestamp: new Date(),
                },
            ],
        });

        /* ------------------------------------------------------------------ */
        /* Google Sheets                                                       */
        /* ------------------------------------------------------------------ */

        const sectorDoc = sectorId
            ? await Sector.findById(sectorId).select("name").lean()
            : null;

        const sectorName = sectorDoc?.name || "Diğerleri";

        const productNames = isOthers
            ? customProducts.map((p: any) => p.productName).join(", ")
            : snapshotProducts.map((p: any) => p.productName).join(", ");

        const groupNames = isOthers
            ? customProducts.map((p: any) => p.productionGroupName).join(", ")
            : snapshotProducts.map((p: any) => p.productionGroupName).join(", ");

        const fullName = [firstName, lastName].filter(Boolean).join(" ") || "-";
        const dateStr = new Date().toLocaleString("tr-TR");
        try {
            const { sheets, spreadsheetId } = await getGoogleSheets();
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: "Response!A:M",
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [
                        [
                            dateStr,
                            companyName,
                            firstName || "-",
                            lastName || "-",
                            email,
                            phone,
                            province,
                            district,
                            address || "-",
                            sectorName,
                            groupNames,
                            productNames,
                            newRequest._id.toString(),
                        ],
                    ],
                },
            });
        } catch (err) {
            console.error("Google Sheets hatası:", err);
        }

        /* ------------------------------------------------------------------ */
        /* Email                                                               */
        /* ------------------------------------------------------------------ */

        try {
            const emailHtml = await render(
                SampleRequestEmail({
                    companyName,
                    fullName,
                    email,
                    phone,
                    province,
                    district,
                    address: address || "-",
                    sector: isOthers ? "Diğerleri" : sectorName,
                    productionGroup: groupNames,
                    products: productNames,
                    date: dateStr,
                })
            );

            /* await Promise.all(
                ["kubilayuysal.ceyhunlarplastik@gmail.com"].map((to) =>
                    sendMail({
                        to,
                        subject: `Yeni Numune Talebi: ${companyName}`,
                        html: emailHtml,
                    })
                )
            ); */
        } catch (err) {
            console.error("Email hatası:", err);
        }

        return NextResponse.json({ success: true, data: newRequest }, { status: 201 });
    } catch (error) {
        console.error("Submission Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}



