"use client";

import { useActionState } from "react";
import { createTask, type WorkActionState } from "@/services/work-actions";
import { TASK_PRIORITY, TASK_STATUS } from "@/lib/work/constants";

export function CreateTaskForm() {
  const [state, action, pending] = useActionState<WorkActionState, FormData>(
    createTask,
    undefined
  );

  return (
    <form action={action} className="space-y-3">
      {state?.ok && (
        <div role="alert" className="alert alert-success alert-soft">
          <span>{state.message}</span>
        </div>
      )}
      {state?.message && !state.ok && (
        <div role="alert" className="alert alert-error alert-soft">
          <span>{state.message}</span>
        </div>
      )}
      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="title">Title</label>
        <input id="title" name="title" required className="input w-full" placeholder="Task title" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="priority">Priority</label>
          <select id="priority" name="priority" className="select w-full" defaultValue="medium">
            {TASK_PRIORITY.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="status">Status</label>
          <select id="status" name="status" className="select w-full" defaultValue="todo">
            {TASK_STATUS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="dueAt">Due date</label>
          <input id="dueAt" name="dueAt" type="date" className="input w-full" />
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="assignedTo">Assignee</label>
          <input id="assignedTo" name="assignedTo" className="input w-full" placeholder="User ID" />
        </div>
      </div>
      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Creating…" : "Create task"}
      </button>
    </form>
  );
}