import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IRequestProduct {
    productId: mongoose.Types.ObjectId | null; // product silinirse null olabilir
    productName: string;

    productionGroupId: mongoose.Types.ObjectId | null;
    productionGroupName: string;
}

export interface IRequestCustomProduct {
    productionGroupName: string;
    productName: string;
}

export interface IRequestStatusHistory {
    status: string;
    note?: string;
    updatedBy?: string;
    timestamp: Date;
}

export interface IRequest extends Document {
    companyName: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    province: string;
    district: string;
    address?: string;

    sectorId: mongoose.Types.ObjectId | null;
    productionGroupIds: mongoose.Types.ObjectId[];
    products: IRequestProduct[];

    status: string;
    statusHistory: IRequestStatusHistory[];

    /**
   * Eğer müşteri "Diğer" seçtiyse
   * admin tarafından tanımlı olmayan değerler
   */
    customProducts: IRequestCustomProduct[];
}

const RequestSchema = new Schema<IRequest>(
    {
        companyName: { type: String, required: true },
        firstName: String,
        lastName: String,
        email: { type: String, required: true },
        phone: { type: String, required: true },
        province: { type: String, required: true },
        district: { type: String, required: true },
        address: String,

        sectorId: { type: Schema.Types.ObjectId, ref: "Sector", default: null },

        productionGroupIds: [
            { type: Schema.Types.ObjectId, ref: "ProductionGroup" },
        ],

        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    default: null,
                },
                productName: {
                    type: String,
                    required: true,
                },

                productionGroupId: {
                    type: Schema.Types.ObjectId,
                    ref: "ProductionGroup",
                    default: null,
                },
                productionGroupName: {
                    type: String,
                    required: true,
                },
            },
        ],

        status: {
            type: String,
            enum: [
                "pending",
                "review",
                "approved",
                "preparing",
                "shipped",
                "delivered",
                "completed",
                "cancelled",
            ],
            default: "pending",
        },

        statusHistory: [
            {
                status: String,
                note: String,
                updatedBy: String,
                timestamp: { type: Date, default: Date.now },
            },
        ],
        customProducts: [
            {
                productionGroupName: {
                    type: String,
                    required: true,
                    trim: true,
                },
                productName: {
                    type: String,
                    required: true,
                    trim: true,
                },
            },
        ],
    },
    { timestamps: true }
);

// ✅ defaults: boş array (others flow’da alanlar yokmuş gibi davranır)
RequestSchema.path("productionGroupIds").default(() => []);
RequestSchema.path("products").default(() => []);
RequestSchema.path("customProducts").default(() => []);

// ✅ En kritik: iki akışı enforce et
RequestSchema.pre("validate", function () {
    const isOthers = this.sectorId === null;

    if (isOthers) {
        if (!this.customProducts || this.customProducts.length === 0) {
            throw new Error("Diğerleri için en az bir özel ürün girilmelidir.");
        }
        if (this.products && this.products.length > 0) {
            throw new Error("Diğerleri seçiliyken products dolu olamaz.");
        }
    } else {
        if (!this.products || this.products.length === 0) {
            throw new Error("Normal seçimde en az bir ürün seçilmelidir.");
        }
        if (this.customProducts && this.customProducts.length > 0) {
            throw new Error("Normal seçimde customProducts dolu olamaz.");
        }
    }
});


RequestSchema.index({ sectorId: 1 });
RequestSchema.index({ province: 1 });
RequestSchema.index({ district: 1 });
RequestSchema.index({ sectorId: 1, province: 1 });
RequestSchema.index({ sectorId: 1, province: 1, district: 1 });


export const Request =
    models.Request || model<IRequest>("Request", RequestSchema);
