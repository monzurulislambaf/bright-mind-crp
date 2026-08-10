import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

export const REVIEW_STATUS = [
  "PENDING",
  "APPROVED",
  "AMENDMENTS_REQUIRED",
  "REJECTED",
] as const;

const ReportReviewSchema = new Schema(
  {
    report: { type: Schema.Types.ObjectId, ref: "Report", required: true },
    version: { type: Number, required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: REVIEW_STATUS, required: true },
    comments: { type: String },
    reviewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ReportReviewSchema.index({ report: 1, version: 1 });
ReportReviewSchema.index({ reviewer: 1 });

export type ReportReviewDoc = InferSchemaType<typeof ReportReviewSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var ReportReview: Model<ReportReviewDoc> | undefined;
}

export const ReportReview: Model<ReportReviewDoc> =
  global.ReportReview ??
  (mongoose.models.ReportReview as Model<ReportReviewDoc>) ??
  mongoose.model<ReportReviewDoc>("ReportReview", ReportReviewSchema);

if (process.env.NODE_ENV !== "production") {
  global.ReportReview = ReportReview;
}
