import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  shiprocketEmail: string;
  shiprocketApiKey: string;
  useRealTimeRates: boolean;
  flatShippingRate: number;
  storeEmail: string;
  storePhone: string;
  storeName: string;
  pack4Weight: number;
  pack4Length: number;
  pack4Breadth: number;
  pack4Height: number;
  pack8Weight: number;
  pack8Length: number;
  pack8Breadth: number;
  pack8Height: number;
  pack24Weight: number;
  pack24Length: number;
  pack24Breadth: number;
  pack24Height: number;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    razorpayKeyId: { type: String, default: '' },
    razorpayKeySecret: { type: String, default: '' },
    shiprocketEmail: { type: String, default: '' },
    shiprocketApiKey: { type: String, default: '' },
    useRealTimeRates: { type: Boolean, default: false },
    flatShippingRate: { type: Number, default: 49 },
    storeEmail: { type: String, default: 'info@tangentfnb.com' },
    storePhone: { type: String, default: '9724565952' },
    storeName: { type: String, default: 'Tangent Drinks' },
    pack4Weight: { type: Number, default: 1.5 },
    pack4Length: { type: Number, default: 25 },
    pack4Breadth: { type: Number, default: 18 },
    pack4Height: { type: Number, default: 12 },
    pack8Weight: { type: Number, default: 3.0 },
    pack8Length: { type: Number, default: 30 },
    pack8Breadth: { type: Number, default: 22 },
    pack8Height: { type: Number, default: 15 },
    pack24Weight: { type: Number, default: 9.0 },
    pack24Length: { type: Number, default: 45 },
    pack24Breadth: { type: Number, default: 30 },
    pack24Height: { type: Number, default: 25 },
  },
  { timestamps: true }
);

// Clear model cache in Next.js HMR so schema updates register properly
if (mongoose.models && (mongoose.models as any).Settings) {
  delete (mongoose.models as any).Settings;
}

export const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema);
