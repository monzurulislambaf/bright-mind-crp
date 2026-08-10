import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";
import { ALL_ROLES, type Role } from "@/lib/auth/roles";

export const USER_TYPES = [
  "EMPLOYEE",
  "PARTNER",
  "PSYCHOLOGIST",
  "CLIENT",
] as const;

export const USER_STATUS = [
  "active",
  "inactive",
  "suspended",
  "invited",
  "disabled",
] as const;

const UserSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    /** Primary role (session uses this). */
    role: {
      type: String,
      enum: ALL_ROLES as unknown as Role[],
      default: "INDIVIDUAL_CLIENT",
    },
    /** Multi-role support (design §3 roleIds). */
    roleIds: [{ type: Schema.Types.ObjectId, ref: "Role" }],
    userType: {
      type: String,
      enum: USER_TYPES,
      default: "CLIENT",
    },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    contact: { type: Schema.Types.ObjectId, ref: "Contact" },
    teamId: { type: Schema.Types.ObjectId },
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String },
    status: {
      type: String,
      enum: USER_STATUS,
      default: "active",
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });
UserSchema.index({ organisation: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ userType: 1 });

export type UserDoc = InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var User: Model<UserDoc> | undefined;
}

export const User: Model<UserDoc> =
  global.User ??
  (mongoose.models.User as Model<UserDoc>) ??
  mongoose.model<UserDoc>("User", UserSchema);

if (process.env.NODE_ENV !== "production") {
  global.User = User;
}
