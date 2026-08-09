import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";

const IndividualClientSchema = new Schema(
  {
    clientId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    dateOfBirth: { type: Date },
    consent: { type: Boolean, default: false },
    consentAt: { type: Date },
    status: {
      type: String,
      enum: ["enquiry", "onboarding", "active", "suspended"],
      default: "enquiry",
    },
  },
  { timestamps: true }
);

IndividualClientSchema.index({ email: 1 });
IndividualClientSchema.index({ userId: 1 });

export type IndividualClientDoc = InferSchemaType<typeof IndividualClientSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var IndividualClient: Model<IndividualClientDoc> | undefined;
}

export const IndividualClient: Model<IndividualClientDoc> =
  global.IndividualClient ??
  (mongoose.models.IndividualClient as Model<IndividualClientDoc>) ??
  mongoose.model<IndividualClientDoc>("IndividualClient", IndividualClientSchema);

if (process.env.NODE_ENV !== "production") {
  global.IndividualClient = IndividualClient;
}