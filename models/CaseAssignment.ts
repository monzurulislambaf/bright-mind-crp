import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

export const ASSIGNMENT_TYPES = [
  "CASEWORKER",
  "PSYCHOLOGIST",
  "QUALITY_REVIEW",
  "OPERATIONS",
] as const;

export const ASSIGNMENT_STATUS = [
  "PENDING",
  "ACTIVE",
  "DECLINED",
  "COMPLETED",
  "REVOKED",
] as const;

const CaseAssignmentSchema = new Schema(
  {
    case: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    psychologist: { type: Schema.Types.ObjectId, ref: "Psychologist" },
    assignmentType: { type: String, enum: ASSIGNMENT_TYPES, required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
    assignedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    declinedAt: { type: Date },
    status: { type: String, enum: ASSIGNMENT_STATUS, default: "PENDING" },
    notes: { type: String },
  },
  { timestamps: true }
);

CaseAssignmentSchema.index({ case: 1, status: 1 });
CaseAssignmentSchema.index({ user: 1 });
CaseAssignmentSchema.index({ psychologist: 1 });

export type CaseAssignmentDoc = InferSchemaType<typeof CaseAssignmentSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var CaseAssignment: Model<CaseAssignmentDoc> | undefined;
}

export const CaseAssignment: Model<CaseAssignmentDoc> =
  global.CaseAssignment ??
  (mongoose.models.CaseAssignment as Model<CaseAssignmentDoc>) ??
  mongoose.model<CaseAssignmentDoc>("CaseAssignment", CaseAssignmentSchema);

if (process.env.NODE_ENV !== "production") {
  global.CaseAssignment = CaseAssignment;
}
