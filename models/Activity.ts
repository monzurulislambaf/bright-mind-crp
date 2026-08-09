import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";

export const ACTIVITY_TYPES = [
  "call",
  "email",
  "meeting",
  "note",
  "task",
  "follow_up",
  "status_change",
  "conversion",
] as const;

export const ACTIVITY_DIRECTIONS = ["inbound", "outbound"] as const;

const ActivitySchema = new Schema(
  {
    lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
    type: { type: String, enum: ACTIVITY_TYPES, required: true },
    direction: { type: String, enum: ACTIVITY_DIRECTIONS },
    summary: { type: String, required: true },
    detail: { type: String },
    subject: { type: String },
    dueAt: { type: Date },
    completedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    movedFrom: { type: String },
    movedTo: { type: String },
  },
  { timestamps: true }
);

ActivitySchema.index({ lead: 1, createdAt: -1 });
ActivitySchema.index({ createdBy: 1 });

export type ActivityDoc = InferSchemaType<typeof ActivitySchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Activity: Model<ActivityDoc> | undefined;
}

export const Activity: Model<ActivityDoc> =
  global.Activity ??
  (mongoose.models.Activity as Model<ActivityDoc>) ??
  mongoose.model<ActivityDoc>("Activity", ActivitySchema);

if (process.env.NODE_ENV !== "production") {
  global.Activity = Activity;
}