import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";

const AddressSchema = new Schema(
  {
    line1: String,
    line2: String,
    city: String,
    postcode: String,
    country: { type: String, default: "UK" },
  },
  { _id: false }
);

const OrganisationSchema = new Schema(
  {
    orgId: { type: String, required: true, unique: true },
    organisationId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        "solicitor",
        "corporate",
        "government",
        "other",
        "SOLICITOR_FIRM",
        "PARTNER",
        "OTHER",
      ],
      default: "other",
    },
    registrationNumber: { type: String, trim: true },
    website: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    telephone: { type: String, trim: true },
    address: { type: Schema.Types.Mixed },
    country: { type: String, trim: true },
    billing: {
      billingEmail: String,
      address: AddressSchema,
    },
    billingDetails: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "suspended", "ACTIVE", "INACTIVE"],
      default: "pending",
    },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

OrganisationSchema.index({ name: 1 });
OrganisationSchema.index({ type: 1 });

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
