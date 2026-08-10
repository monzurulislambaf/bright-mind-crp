import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const SettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    category: {
      type: String,
      enum: ["SYSTEM", "CRM", "SECURITY", "NOTIFICATIONS", "FINANCE", "GENERAL"],
      default: "GENERAL",
    },
    description: { type: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

SettingsSchema.index({ category: 1 });

export type SettingsDoc = InferSchemaType<typeof SettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Settings: Model<SettingsDoc> | undefined;
}

export const Settings: Model<SettingsDoc> =
  global.Settings ??
  (mongoose.models.Settings as Model<SettingsDoc>) ??
  mongoose.model<SettingsDoc>("Settings", SettingsSchema);

if (process.env.NODE_ENV !== "production") {
  global.Settings = Settings;
}
