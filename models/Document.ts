import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";

const DocumentVersionSchema = new Schema(
  {
    version: { type: Number, required: true },
    fileName: { type: String, trim: true },
    content: { type: Buffer },
    sizeBytes: { type: Number },
    mimeType: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const DocumentSchema = new Schema(
  {
    documentId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    case: { type: Schema.Types.ObjectId, ref: "Case" },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    access: {
      type: String,
      enum: ["owner", "organisation", "case", "released"],
      default: "owner",
    },
    versions: { type: [DocumentVersionSchema], default: [] },
    released: { type: Boolean, default: false },
    distributed: [{ type: Schema.Types.ObjectId, ref: "User" }],
    visibility: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

DocumentSchema.index({ organisation: 1 });
DocumentSchema.index({ case: 1 });
DocumentSchema.index({ owner: 1 });

export type DocumentDoc = InferSchemaType<typeof DocumentSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var DocumentStore: Model<DocumentDoc> | undefined;
}

const Document: Model<DocumentDoc> =
  global.DocumentStore ??
  (mongoose.models.Document as Model<DocumentDoc>) ??
  mongoose.model<DocumentDoc>("Document", DocumentSchema);

if (process.env.NODE_ENV !== "production") {
  global.DocumentStore = Document;
}

export { Document };