import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";
import { REPORT_STATUS } from "@/lib/report/statuses";

export { REPORT_STATUS };
export type { ReportStatus } from "@/lib/report/statuses";

const ReportVersionSchema = new Schema(
  {
    version: { type: Number, required: true },
    title: { type: String, required: true },
    body: { type: String, default: "" },
    summary: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "Psychologist" },
    authorName: { type: String },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ReportSchema = new Schema(
  {
    reportId: { type: String, required: true, unique: true },
    case: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    title: { type: String, required: true, trim: true },
    status: { type: String, enum: REPORT_STATUS, default: "Draft" },
    currentVersion: { type: Number, default: 1 },
    body: { type: String, default: "" },
    author: { type: Schema.Types.ObjectId, ref: "Psychologist" },
    authorName: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: "User" },
    reviewDecision: { type: String },
    reviewNote: { type: String },
    reviewedAt: { type: Date },
    releasedAt: { type: Date },
    releasedBy: { type: Schema.Types.ObjectId, ref: "User" },
    versions: { type: [ReportVersionSchema], default: [] },
  },
  { timestamps: true }
);

ReportSchema.index({ case: 1, status: 1 });
ReportSchema.index({ status: 1 });

export type ReportDoc = InferSchemaType<typeof ReportSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var ReportStore: Model<ReportDoc> | undefined;
}

export const Report: Model<ReportDoc> =
  global.ReportStore ??
  (mongoose.models.Report as Model<ReportDoc>) ??
  mongoose.model<ReportDoc>("Report", ReportSchema);

if (process.env.NODE_ENV !== "production") {
  global.ReportStore = Report;
}