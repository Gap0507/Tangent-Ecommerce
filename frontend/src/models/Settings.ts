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
    storeEmail: { type: String, default: 'hello@tangentdrinks.com' },
    storePhone: { type: String, default: '+91 98765 43210' },
    storeName: { type: String, default: 'Tangent Drinks' },
  },
  { timestamps: true }
);

// Clear model cache in Next.js HMR so schema updates register properly
if (mongoose.models && (mongoose.models as any).Settings) {
  delete (mongoose.models as any).Settings;
}

export const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema);
