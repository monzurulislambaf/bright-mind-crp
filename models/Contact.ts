import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";

const ContactSchema = new Schema(
  {
    contactId: { type: String, required: true, unique: true },
    lead: { type: Schema.Types.ObjectId, ref: "Lead" },
    organisation: { type: Schema.Types.ObjectId, ref: "Organisation" },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
  },
  { timestamps: true }
);

ContactSchema.index({ email: 1 });
ContactSchema.index({ organisation: 1 });

export type ContactDoc = InferSchemaType<typeof ContactSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Contact: Model<ContactDoc> | undefined;
}

export const Contact: Model<ContactDoc> =
  global.Contact ??
  (mongoose.models.Contact as Model<ContactDoc>) ??
  mongoose.model<ContactDoc>("Contact", ContactSchema);

if (process.env.NODE_ENV !== "production") {
  global.Contact = Contact;
}