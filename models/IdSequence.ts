import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const IdSequenceSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    prefix: { type: String, required: true },
    currentNumber: { type: Number, required: true, default: 0 },
    yearBased: { type: Boolean, default: false },
    year: { type: Number },
  },
  { timestamps: true }
);

export type IdSequenceDoc = InferSchemaType<typeof IdSequenceSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var IdSequence: Model<IdSequenceDoc> | undefined;
}

export const IdSequence: Model<IdSequenceDoc> =
  global.IdSequence ??
  (mongoose.models.IdSequence as Model<IdSequenceDoc>) ??
  mongoose.model<IdSequenceDoc>("IdSequence", IdSequenceSchema);

if (process.env.NODE_ENV !== "production") {
  global.IdSequence = IdSequence;
}
