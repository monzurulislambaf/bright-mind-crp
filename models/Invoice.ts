import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

export const INVOICE_STATUS = [
  "DRAFT",
  "ISSUED",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
  "VOID",
] as const;

const InvoiceSchema = new Schema(
  {
    invoiceId: { type: String, required: true, unique: true },
    case: { type: Schema.Types.ObjectId, ref: "Case" },
    quotation: { type: Schema.Types.ObjectId, ref: "Quotation" },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    client: { type: Schema.Types.ObjectId, ref: "IndividualClient" },
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "GBP" },
    status: { type: String, enum: INVOICE_STATUS, default: "DRAFT" },
    dueDate: { type: Date },
    issuedAt: { type: Date },
    paidAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

InvoiceSchema.index({ case: 1 });
InvoiceSchema.index({ organisation: 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ dueDate: 1 });

export type InvoiceDoc = InferSchemaType<typeof InvoiceSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Invoice: Model<InvoiceDoc> | undefined;
}

export const Invoice: Model<InvoiceDoc> =
  global.Invoice ??
  (mongoose.models.Invoice as Model<InvoiceDoc>) ??
  mongoose.model<InvoiceDoc>("Invoice", InvoiceSchema);

if (process.env.NODE_ENV !== "production") {
  global.Invoice = Invoice;
}
