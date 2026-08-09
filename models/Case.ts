import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";
import { CASE_STATUS, OFFER_STATUS } from "@/lib/cases/statuses";

export { CASE_STATUS, OFFER_STATUS };
export type { CaseStatus, OfferStatus } from "@/lib/cases/statuses";

const OfferSchema = new Schema(
  {
    psychologist: { type: Schema.Types.ObjectId, ref: "Psychologist", required: true },
    status: { type: String, enum: OFFER_STATUS, default: "Offered" },
    conflict: { type: Boolean, default: false },
    expiresAt: { type: Date },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

const CaseSchema = new Schema(
  {
    caseId: { type: String, required: true, unique: true },
    client: { type: Schema.Types.ObjectId, ref: "IndividualClient" },
    instructingParty: { type: String },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    solicitor: { type: Schema.Types.ObjectId, ref: "Solicitor" },
    serviceType: { type: String, trim: true },
    reportType: { type: String, trim: true },
    deadline: { type: Date },
    status: { type: String, enum: CASE_STATUS, default: "New Instruction" },
    caseworker: { type: Schema.Types.ObjectId, ref: "User" },
    reviewer: { type: Schema.Types.ObjectId, ref: "User" },
    assignedPsychologist: { type: Schema.Types.ObjectId, ref: "Psychologist" },
    offers: { type: [OfferSchema], default: [] },
    internalNotes: { type: String },
  },
  { timestamps: true }
);

CaseSchema.index({ status: 1 });
CaseSchema.index({ organisation: 1 });
CaseSchema.index({ client: 1 });
CaseSchema.index({ assignedPsychologist: 1 });
CaseSchema.index({ deadline: 1 });

export type CaseDoc = InferSchemaType<typeof CaseSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Case: Model<CaseDoc> | undefined;
}

export const Case: Model<CaseDoc> =
  global.Case ??
  (mongoose.models.Case as Model<CaseDoc>) ??
  mongoose.model<CaseDoc>("Case", CaseSchema);

if (process.env.NODE_ENV !== "production") {
  global.Case = Case;
}