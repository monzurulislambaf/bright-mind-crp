import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";
import { ALL_ROLES, type Role } from "@/lib/auth/roles";

const UserSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ALL_ROLES as unknown as Role[], default: "INDIVIDUAL_CLIENT" },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });
UserSchema.index({ organisation: 1 });

export type UserDoc = InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var User: Model<UserDoc> | undefined;
}

export const User: Model<UserDoc> =
  global.User ?? (mongoose.models.User as Model<UserDoc>) ??
  mongoose.model<UserDoc>("User", UserSchema);

if (process.env.NODE_ENV !== "production") {
  global.User = User;
}