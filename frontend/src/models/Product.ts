import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  isActive: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
    image: { type: String },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
