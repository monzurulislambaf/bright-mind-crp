import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";

/** Significant actions that must be audited (design §26). */
export const AUDIT_ACTIONS = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "VIEW",
  "DOWNLOAD",
  "EXPORT",
  "LOGIN",
  "LOGOUT",
  "PERMISSION_CHANGE",
  "ASSIGN",
  "REASSIGN",
  "APPROVE",
  "REJECT",
  "CONVERT",
  "RELEASE",
  "STATUS_CHANGE",
  "DOCUMENT_DOWNLOAD",
  "ROLE_CHANGE",
] as const;

const AuditLogSchema = new Schema(
  {
    auditId: { type: String, unique: true, sparse: true },
    actor: { type: String },
    actorUserId: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceType: { type: String },
    resourceId: { type: String },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    ip: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ actor: 1 });
AuditLogSchema.index({ actorUserId: 1 });
AuditLogSchema.index({ resource: 1, resourceId: 1 });
AuditLogSchema.index({ resourceType: 1, resourceId: 1 });
AuditLogSchema.index({ action: 1 });

export type AuditLogDoc = InferSchemaType<typeof AuditLogSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var AuditLog: Model<AuditLogDoc> | undefined;
}

const AuditLog: Model<AuditLogDoc> =
  global.AuditLog ??
  (mongoose.models.AuditLog as Model<AuditLogDoc>) ??
  mongoose.model<AuditLogDoc>("AuditLog", AuditLogSchema);

if (process.env.NODE_ENV !== "production") {
  global.AuditLog = AuditLog;
}

export { AuditLog };
