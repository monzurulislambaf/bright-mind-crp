import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

export const ONBOARDING_TYPES = [
  "SOLICITOR_FIRM",
  "HCPC_PSYCHOLOGIST",
  "INDIVIDUAL_CLIENT",
] as const;

export const ONBOARDING_STATUS = [
  "PENDING",
  "IN_PROGRESS",
  "AWAITING_REVIEW",
  "APPROVED",
  "REJECTED",
] as const;

const ChecklistItemSchema = new Schema(
  {
    name: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    notes: { type: String },
  },
  { _id: false }
);

const OnboardingSchema = new Schema(
  {
    onboardingId: { type: String, required: true, unique: true },
    lead: { type: Schema.Types.ObjectId, ref: "Lead" },
    type: { type: String, enum: ONBOARDING_TYPES, required: true },
    status: { type: String, enum: ONBOARDING_STATUS, default: "PENDING" },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    checklist: { type: [ChecklistItemSchema], default: [] },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectedReason: { type: String },
  },
  { timestamps: true }
);

OnboardingSchema.index({ status: 1 });
OnboardingSchema.index({ type: 1 });
OnboardingSchema.index({ lead: 1 });

export type OnboardingDoc = InferSchemaType<typeof OnboardingSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Onboarding: Model<OnboardingDoc> | undefined;
}

export const Onboarding: Model<OnboardingDoc> =
  global.Onboarding ??
  (mongoose.models.Onboarding as Model<OnboardingDoc>) ??
  mongoose.model<OnboardingDoc>("Onboarding", OnboardingSchema);

if (process.env.NODE_ENV !== "production") {
  global.Onboarding = Onboarding;
}
