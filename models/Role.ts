import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";
import { ALL_ROLES, type Role as RoleName } from "@/lib/auth/roles";
import { PERMISSION_SCOPES, type PermissionScope } from "@/lib/auth/scopes";

const RolePermissionSchema = new Schema(
  {
    permission: { type: String, required: true },
    scope: {
      type: String,
      enum: PERMISSION_SCOPES as unknown as PermissionScope[],
      default: "ALL",
    },
  },
  { _id: false }
);

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ALL_ROLES as unknown as RoleName[],
    },
    displayName: { type: String, required: true },
    permissions: { type: [RolePermissionSchema], default: [] },
    /** Flat permission strings for quick checks (resource:action). */
    permissionKeys: { type: [String], default: [] },
    defaultScope: {
      type: String,
      enum: PERMISSION_SCOPES as unknown as PermissionScope[],
      default: "OWN",
    },
    active: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

RoleSchema.index({ active: 1 });

export type RoleDoc = InferSchemaType<typeof RoleSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var RoleModel: Model<RoleDoc> | undefined;
}

export const Role: Model<RoleDoc> =
  global.RoleModel ??
  (mongoose.models.Role as Model<RoleDoc>) ??
  mongoose.model<RoleDoc>("Role", RoleSchema);

if (process.env.NODE_ENV !== "production") {
  global.RoleModel = Role;
}
