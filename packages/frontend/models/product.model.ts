import mongoose, { Schema, Document } from "mongoose";

export interface ProductBase {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface IProduct extends ProductBase, Document {
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, unique: true },
        // slug: { type: String, required: false, unique: true },
        slug: { type: String },
        description: String,
        imageUrl: String,
    },
    { timestamps: true }
);

// TypeScript safe slug generator
ProductSchema.pre<IProduct>("validate", function () {
    if (!this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    }
});

export const Product =
    mongoose.models.Product ||
    mongoose.model<IProduct>("Product", ProductSchema);
