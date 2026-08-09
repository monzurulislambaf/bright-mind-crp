import mongoose, {
  Schema,
  type Model,
  type InferSchemaType,
} from "mongoose";

const FormSubmissionSchema = new Schema(
  {
    formId: { type: String, required: true, unique: true },
    formType: { type: String, required: true },
    source: { type: String, required: true },
    campaign: { type: String },
    landingPage: { type: String },
    lead: { type: Schema.Types.ObjectId, ref: "Lead" },
    payload: { type: Schema.Types.Mixed },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

FormSubmissionSchema.index({ formType: 1 });
FormSubmissionSchema.index({ createdAt: -1 });

export type FormSubmissionDoc = InferSchemaType<typeof FormSubmissionSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var FormSubmission: Model<FormSubmissionDoc> | undefined;
}

export const FormSubmission: Model<FormSubmissionDoc> =
  global.FormSubmission ??
  (mongoose.models.FormSubmission as Model<FormSubmissionDoc>) ??
  mongoose.model<FormSubmissionDoc>("FormSubmission", FormSubmissionSchema);

if (process.env.NODE_ENV !== "production") {
  global.FormSubmission = FormSubmission;
}