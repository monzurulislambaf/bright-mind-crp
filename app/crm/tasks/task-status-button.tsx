"use client";

import { useTransition } from "react";
import { updateTaskStatus } from "@/services/work-actions";
import { TASK_STATUS } from "@/lib/work/constants";

export function TaskStatusButton({ taskId, current }: { taskId: string; current: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      className="select select-sm"
      value={current}
      disabled={pending}
      onChange={(e) => startTransition(() => { void updateTaskStatus(taskId, e.target.value); })}
    >
      {TASK_STATUS.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}