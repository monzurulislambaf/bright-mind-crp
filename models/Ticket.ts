import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";
import { TICKET_CATEGORY, TICKET_PRIORITY, TICKET_STATUS } from "@/lib/work/constants";

export { TICKET_CATEGORY, TICKET_PRIORITY, TICKET_STATUS };

const TicketMessageSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    internal: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const TicketSchema = new Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    subject: { type: String, required: true, trim: true },
    category: { type: String, enum: TICKET_CATEGORY, default: "other" },
    priority: { type: String, enum: TICKET_PRIORITY, default: "medium" },
    status: { type: String, enum: TICKET_STATUS, default: "open" },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    case: { type: Schema.Types.ObjectId, ref: "Case" },
    messages: { type: [TicketMessageSchema], default: [] },
    escalated: { type: Boolean, default: false },
    resolution: { type: String },
    resolvedAt: { type: Date },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

TicketSchema.index({ status: 1 });
TicketSchema.index({ priority: 1 });
TicketSchema.index({ assignee: 1 });
TicketSchema.index({ reporter: 1 });
TicketSchema.index({ case: 1 });
TicketSchema.index({ organisation: 1 });

export type TicketDoc = InferSchemaType<typeof TicketSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Ticket: Model<TicketDoc> | undefined;
}

export const Ticket: Model<TicketDoc> =
  global.Ticket ??
  (mongoose.models.Ticket as Model<TicketDoc>) ??
  mongoose.model<TicketDoc>("Ticket", TicketSchema);

if (process.env.NODE_ENV !== "production") {
  global.Ticket = Ticket;
}