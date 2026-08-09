import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

export const NOTIFICATION_TYPES = [
  "lead_assignment",
  "case_assignment",
  "case_offer",
  "appointment",
  "info_request",
  "report_update",
  "quality_review",
  "report_release",
  "ticket_update",
  "payment_update",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true },
    body: { type: String },
    link: { type: String },
    read: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: -1 });

export type NotificationDoc = InferSchemaType<typeof NotificationSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var NotificationStore: Model<NotificationDoc> | undefined;
}

export const Notification: Model<NotificationDoc> =
  global.NotificationStore ??
  (mongoose.models.Notification as Model<NotificationDoc>) ??
  mongoose.model<NotificationDoc>("Notification", NotificationSchema);

if (process.env.NODE_ENV !== "production") {
  global.NotificationStore = Notification;
}