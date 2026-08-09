import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";

export const QUALIFIED_KIND = [
  "solicitor",
  "psychologist",
  "individual",
  "other",
] as const;

export type QualifiedKind = (typeof QUALIFIED_KIND)[number];

const QualifiedLeadSchema = new Schema(
  {
    qualifiedId: { type: String, required: true, unique: true },
    lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true, unique: true },
    kind: { type: String, enum: QUALIFIED_KIND, required: true },
    notes: { type: String },
    converted: { type: Boolean, default: false },
    convertedTo: { type: String },
    qualifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    qualifiedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

QualifiedLeadSchema.index({ kind: 1 });
QualifiedLeadSchema.index({ converted: 1 });

export type QualifiedLeadDoc = InferSchemaType<typeof QualifiedLeadSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var QualifiedLead: Model<QualifiedLeadDoc> | undefined;
}

export const QualifiedLead: Model<QualifiedLeadDoc> =
  global.QualifiedLead ??
  (mongoose.models.QualifiedLead as Model<QualifiedLeadDoc>) ??
  mongoose.model<QualifiedLeadDoc>("QualifiedLead", QualifiedLeadSchema);

if (process.env.NODE_ENV !== "production") {
  global.QualifiedLead = QualifiedLead;
}