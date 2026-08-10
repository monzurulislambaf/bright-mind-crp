import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const CampaignSchema = new Schema(
  {
    campaignId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    channel: { type: String, trim: true },
    source: { type: String, trim: true },
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"],
      default: "DRAFT",
    },
    startAt: { type: Date },
    endAt: { type: Date },
    budget: { type: Number },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

CampaignSchema.index({ status: 1 });
CampaignSchema.index({ name: 1 });

export type CampaignDoc = InferSchemaType<typeof CampaignSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Campaign: Model<CampaignDoc> | undefined;
}

export const Campaign: Model<CampaignDoc> =
  global.Campaign ??
  (mongoose.models.Campaign as Model<CampaignDoc>) ??
  mongoose.model<CampaignDoc>("Campaign", CampaignSchema);

if (process.env.NODE_ENV !== "production") {
  global.Campaign = Campaign;
}
