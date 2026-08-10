import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";
import { LEAD_STATUS } from "@/lib/crm/statuses";

export { LEAD_STATUS };
export type { LeadStatus } from "@/lib/crm/statuses";

const LeadSchema = new Schema(
  {
    leadId: { type: String, required: true, unique: true },
    leadType: {
      type: String,
      enum: ["SOLICITOR", "PSYCHOLOGIST", "INDIVIDUAL", "OTHER"],
      default: "OTHER",
    },
    source: { type: String, required: true },
    campaign: { type: String },
    campaignId: { type: Schema.Types.ObjectId, ref: "Campaign" },
    landingPage: { type: String },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    role: { type: String, trim: true },
    status: { type: String, enum: LEAD_STATUS, default: "New" },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    lostReason: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    ownerLabel: { type: String, trim: true },
    teamId: { type: Schema.Types.ObjectId },
    contact: { type: Schema.Types.ObjectId, ref: "Contact" },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    qualifier: {
      type: String,
      enum: [
        "solicitor_partner",
        "psychologist",
        "individual",
        "request_report",
        "callback",
        "general",
      ],
      default: "general",
    },
    serviceInterest: { type: String, trim: true },
    requirement: { type: String },
    timescale: { type: String },
    qualification: {
      score: { type: Number },
      authority: { type: Boolean },
      suitability: { type: Boolean },
      reason: { type: String },
    },
    expectedConversionDate: { type: Date },
    notes: { type: String },
    consent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LeadSchema.index({ email: 1 });
LeadSchema.index({ phone: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ owner: 1 });
LeadSchema.index({ organisation: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ campaignId: 1 });

export type LeadDoc = InferSchemaType<typeof LeadSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Lead: Model<LeadDoc> | undefined;
}

export const Lead: Model<LeadDoc> =
  global.Lead ??
  (mongoose.models.Lead as Model<LeadDoc>) ??
  mongoose.model<LeadDoc>("Lead", LeadSchema);

if (process.env.NODE_ENV !== "production") {
  global.Lead = Lead;
}
