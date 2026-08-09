import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";

const OrganisationSchema = new Schema(
  {
    orgId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["solicitor", "corporate", "government", "other"],
      default: "other",
    },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    country: { type: String, trim: true },
    billingDetails: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "suspended"],
      default: "pending",
    },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

OrganisationSchema.index({ name: 1 });

export type OrganisationDoc = InferSchemaType<typeof OrganisationSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Organisation: Model<OrganisationDoc> | undefined;
}

export const Organisation: Model<OrganisationDoc> =
  global.Organisation ??
  (mongoose.models.Organisation as Model<OrganisationDoc>) ??
  mongoose.model<OrganisationDoc>("Organisation", OrganisationSchema);

if (process.env.NODE_ENV !== "production") {
  global.Organisation = Organisation;
}