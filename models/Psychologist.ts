import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";

export const PSYCHOLOGIST_STATUS = [
  "Pending",
  "Under Review",
  "More Information Required",
  "Approved",
  "Rejected",
  "Suspended",
] as const;

const PsychologistSchema = new Schema(
  {
    psychologistId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    hcpcNumber: { type: String, unique: true, sparse: true },
    qualifications: [{ type: String }],
    cvKey: { type: String },
    insuranceDetails: { type: String },
    expertise: [{ type: String }],
    jurisdictions: [{ type: String }],
    availability: { type: String },
    status: {
      type: String,
      enum: PSYCHOLOGIST_STATUS,
      default: "Pending",
    },
    approvedAt: { type: Date },
    rejectedReason: { type: String },
  },
  { timestamps: true }
);

PsychologistSchema.index({ status: 1 });

export type PsychologistDoc = InferSchemaType<typeof PsychologistSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Psychologist: Model<PsychologistDoc> | undefined;
}

export const Psychologist: Model<PsychologistDoc> =
  global.Psychologist ??
  (mongoose.models.Psychologist as Model<PsychologistDoc>) ??
  mongoose.model<PsychologistDoc>("Psychologist", PsychologistSchema);

if (process.env.NODE_ENV !== "production") {
  global.Psychologist = Psychologist;
}