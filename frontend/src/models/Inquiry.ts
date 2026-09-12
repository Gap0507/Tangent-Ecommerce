import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: "No Subject" },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
