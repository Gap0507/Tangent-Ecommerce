import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountType: 'FLAT' | 'PERCENTAGE' | 'FREE_SHIPPING';
  discountValue: number; // 0 for FREE_SHIPPING
  minOrderValue: number;
  usageCount: number;
  maxUsageLimit: number; // 0 for unlimited
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['FLAT', 'PERCENTAGE', 'FREE_SHIPPING'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0, min: 0 },
    usageCount: { type: Number, default: 0 },
    maxUsageLimit: { type: Number, default: 0 }, // 0 means unlimited
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon: Model<ICoupon> = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', couponSchema);
