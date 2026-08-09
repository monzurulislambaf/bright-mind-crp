import { listTasks, taskStats } from "@/services/tasks";
import { CreateTaskForm } from "./create-task-form";
import { TaskStatusButton } from "./task-status-button";
import { TASK_STATUS_BADGE, TASK_PRIORITY_BADGE } from "@/lib/work/badges";

export const dynamic = "force-dynamic";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const status = params.status || undefined;
  const [tasks, stats] = await Promise.all([listTasks({ status }), taskStats()]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="mt-1 text-base-content/70">{tasks.length} task(s)</p>
        </div>
      </div>

      <div className="stats stats-vertical w-full bg-base-200 shadow-sm sm:stats-horizontal">
        <div className="stat">
          <div className="stat-title">To do</div>
          <div className="stat-value">{stats.todo}</div>
        </div>
        <div className="stat">
          <div className="stat-title">In progress</div>
          <div className="stat-value text-info">{stats.inProgress}</div>
        </div>
        <div className="stat">
          <div className="stat-title">In review</div>
          <div className="stat-value text-warning">{stats.review}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Done</div>
          <div className="stat-value text-success">{stats.done}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card card-body card-border mt-6 bg-base-100 lg:col-span-2">
          <h2 className="text-lg font-semibold">All tasks</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
{tasks.map((t) => {
                  const pb = TASK_PRIORITY_BADGE[t.priority] ?? "neutral";
                  const sbBadge = TASK_STATUS_BADGE[t.status] ?? "neutral";
                  return (
                    <tr key={String(t._id)}>
                      <td>
                        <div className="font-medium">{t.title}</div>
                        <div className="text-xs text-base-content/60">{t.taskId}</div>
                      </td>
                      <td>
                        <span className={`badge badge-soft badge-${pb}`}>{t.priority}</span>
                      </td>
                      <td className="text-sm">
                        {t.dueAt ? new Date(t.dueAt).toLocaleDateString() : "—"}
                      </td>
                      <td>
                        <span className={`badge badge-soft badge-${sbBadge}`}>{t.status}</span>
                      </td>
                      <td>
                        <TaskStatusButton taskId={String(t._id)} current={t.status} />
                      </td>
                    </tr>
                  );
                })}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-base-content/60">
                      No tasks yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card card-body card-border mt-6 bg-base-100">
          <h2 className="text-lg font-semibold">New task</h2>
          <div className="mt-2">
            <CreateTaskForm />
          </div>
        </div>
      </div>
    </div>
  );
}