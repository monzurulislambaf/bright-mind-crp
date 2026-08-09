import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";
import { APPOINTMENT_TYPE, APPOINTMENT_STATUS } from "@/lib/appointment/constants";

export { APPOINTMENT_TYPE, APPOINTMENT_STATUS };

const AppointmentSchema = new Schema(
  {
    appointmentId: { type: String, required: true, unique: true },
    kind: { type: String, enum: APPOINTMENT_TYPE, default: "other" },
    status: { type: String, enum: APPOINTMENT_STATUS, default: "scheduled" },
    title: { type: String, trim: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date },
    case: { type: Schema.Types.ObjectId, ref: "Case" },
    psychologist: { type: Schema.Types.ObjectId, ref: "Psychologist" },
    client: { type: Schema.Types.ObjectId, ref: "IndividualClient" },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    location: { type: String },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

AppointmentSchema.index({ startsAt: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ case: 1 });
AppointmentSchema.index({ psychologist: 1 });
AppointmentSchema.index({ client: 1 });

export type AppointmentDoc = InferSchemaType<typeof AppointmentSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Appointment: Model<AppointmentDoc> | undefined;
}

export const Appointment: Model<AppointmentDoc> =
  global.Appointment ??
  (mongoose.models.Appointment as Model<AppointmentDoc>) ??
  mongoose.model<AppointmentDoc>("Appointment", AppointmentSchema);

if (process.env.NODE_ENV !== "production") {
  global.Appointment = Appointment;
}