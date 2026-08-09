import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";

const SolicitorSchema = new Schema(
  {
    solicitorId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation", required: true },
    contactName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "suspended"],
      default: "pending",
    },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

SolicitorSchema.index({ organisation: 1 });

export type SolicitorDoc = InferSchemaType<typeof SolicitorSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Solicitor: Model<SolicitorDoc> | undefined;
}

export const Solicitor: Model<SolicitorDoc> =
  global.Solicitor ??
  (mongoose.models.Solicitor as Model<SolicitorDoc>) ??
  mongoose.model<SolicitorDoc>("Solicitor", SolicitorSchema);

if (process.env.NODE_ENV !== "production") {
  global.Solicitor = Solicitor;
}