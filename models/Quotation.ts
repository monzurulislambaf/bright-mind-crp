import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

export const QUOTATION_STATUS = [
  "DRAFT",
  "SENT",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
] as const;

const QuotationSchema = new Schema(
  {
    quotationId: { type: String, required: true, unique: true },
    case: { type: Schema.Types.ObjectId, ref: "Case" },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    client: { type: Schema.Types.ObjectId, ref: "IndividualClient" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "GBP" },
    status: { type: String, enum: QUOTATION_STATUS, default: "DRAFT" },
    description: { type: String },
    lineItems: [
      {
        description: String,
        amount: Number,
        quantity: { type: Number, default: 1 },
      },
    ],
    issuedAt: { type: Date },
    approvedAt: { type: Date },
    expiresAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

QuotationSchema.index({ case: 1 });
QuotationSchema.index({ organisation: 1 });
QuotationSchema.index({ status: 1 });

export type QuotationDoc = InferSchemaType<typeof QuotationSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Quotation: Model<QuotationDoc> | undefined;
}

export const Quotation: Model<QuotationDoc> =
  global.Quotation ??
  (mongoose.models.Quotation as Model<QuotationDoc>) ??
  mongoose.model<QuotationDoc>("Quotation", QuotationSchema);

if (process.env.NODE_ENV !== "production") {
  global.Quotation = Quotation;
}
