import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpend: number;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    totalOrders: { type: Number, default: 0 },
    totalSpend: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', customerSchema);
