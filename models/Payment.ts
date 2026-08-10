import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

export const PAYMENT_STATUS = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
] as const;

const PaymentSchema = new Schema(
  {
    paymentId: { type: String, required: true, unique: true },
    invoice: { type: Schema.Types.ObjectId, ref: "Invoice", required: true },
    case: { type: Schema.Types.ObjectId, ref: "Case" },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "GBP" },
    method: { type: String, trim: true },
    reference: { type: String, trim: true },
    status: { type: String, enum: PAYMENT_STATUS, default: "PENDING" },
    paidAt: { type: Date },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
  },
  { timestamps: true }
);

PaymentSchema.index({ invoice: 1 });
PaymentSchema.index({ status: 1 });

export type PaymentDoc = InferSchemaType<typeof PaymentSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Payment: Model<PaymentDoc> | undefined;
}

export const Payment: Model<PaymentDoc> =
  global.Payment ??
  (mongoose.models.Payment as Model<PaymentDoc>) ??
  mongoose.model<PaymentDoc>("Payment", PaymentSchema);

if (process.env.NODE_ENV !== "production") {
  global.Payment = Payment;
}
