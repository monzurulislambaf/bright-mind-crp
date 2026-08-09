import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";
import { TASK_PRIORITY, TASK_STATUS, TASK_LINK_TYPES } from "@/lib/work/constants";

export { TASK_PRIORITY, TASK_STATUS, TASK_LINK_TYPES };

const TaskSchema = new Schema(
  {
    taskId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    priority: { type: String, enum: TASK_PRIORITY, default: "medium" },
    status: { type: String, enum: TASK_STATUS, default: "todo" },
    dueAt: { type: Date },
    reminderAt: { type: Date },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    linkType: { type: String, enum: TASK_LINK_TYPES },
    linkId: { type: Schema.Types.ObjectId },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ dueAt: 1 });
TaskSchema.index({ linkType: 1, linkId: 1 });

export type TaskDoc = InferSchemaType<typeof TaskSchema> & {
  _id: mongoose.Types.ObjectId;
};

declare global {
  var Task: Model<TaskDoc> | undefined;
}

export const Task: Model<TaskDoc> =
  global.Task ??
  (mongoose.models.Task as Model<TaskDoc>) ??
  mongoose.model<TaskDoc>("Task", TaskSchema);

if (process.env.NODE_ENV !== "production") {
  global.Task = Task;
}