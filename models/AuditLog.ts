import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";

const AuditLogSchema = new Schema(
  {
    actor: { type: String },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ actor: 1 });
AuditLogSchema.index({ resource: 1, resourceId: 1 });

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