import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

export const DOC_PERMISSIONS = [
  "VIEW",
  "DOWNLOAD",
  "UPLOAD_VERSION",
  "SHARE",
] as const;

const DocumentPermissionSchema = new Schema(
  {
    document: { type: Schema.Types.ObjectId, ref: "Document", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    permissions: {
      type: [String],
      enum: DOC_PERMISSIONS,
      default: ["VIEW"],
    },
    grantedBy: { type: Schema.Types.ObjectId, ref: "User" },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

DocumentPermissionSchema.index({ document: 1 });
DocumentPermissionSchema.index({ user: 1 });
DocumentPermissionSchema.index({ organisation: 1 });

export type DocumentPermissionDoc = InferSchemaType<
  typeof DocumentPermissionSchema
> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var DocumentPermission: Model<DocumentPermissionDoc> | undefined;
}

export const DocumentPermission: Model<DocumentPermissionDoc> =
  global.DocumentPermission ??
  (mongoose.models.DocumentPermission as Model<DocumentPermissionDoc>) ??
  mongoose.model<DocumentPermissionDoc>(
    "DocumentPermission",
    DocumentPermissionSchema
  );

if (process.env.NODE_ENV !== "production") {
  global.DocumentPermission = DocumentPermission;
}
