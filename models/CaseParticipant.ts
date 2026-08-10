import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

export const PARTICIPANT_TYPES = [
  "SOLICITOR",
  "CLIENT",
  "CASEWORKER",
  "PSYCHOLOGIST",
  "OBSERVER",
] as const;

export const ACCESS_LEVELS = [
  "VIEW",
  "AUTHORISED",
  "FULL",
  "RESTRICTED",
] as const;

const CaseParticipantSchema = new Schema(
  {
    case: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    participantType: { type: String, enum: PARTICIPANT_TYPES, required: true },
    accessLevel: { type: String, enum: ACCESS_LEVELS, default: "AUTHORISED" },
    active: { type: Boolean, default: true },
    addedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

CaseParticipantSchema.index({ case: 1, active: 1 });
CaseParticipantSchema.index({ user: 1 });
CaseParticipantSchema.index({ organisation: 1 });

export type CaseParticipantDoc = InferSchemaType<typeof CaseParticipantSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var CaseParticipant: Model<CaseParticipantDoc> | undefined;
}

export const CaseParticipant: Model<CaseParticipantDoc> =
  global.CaseParticipant ??
  (mongoose.models.CaseParticipant as Model<CaseParticipantDoc>) ??
  mongoose.model<CaseParticipantDoc>("CaseParticipant", CaseParticipantSchema);

if (process.env.NODE_ENV !== "production") {
  global.CaseParticipant = CaseParticipant;
}
