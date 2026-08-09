import Link from "next/link";
import { CASE_BADGE } from "@/lib/cases/statuses";

type CaseLean = {
  _id: unknown;
  caseId: string;
  serviceType?: string | null;
  reportType?: string | null;
  status: string;
  instructingParty?: string | null;
  deadline?: Date | null;
  clientProps?: string;
  assignedPsychologist?: unknown;
};

function formatDate(d?: Date | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PortalCaseTable({ cases }: { cases: CaseLean[] }) {
  if (cases.length === 0) {
    return (
      <div className="card card-body items-center bg-base-200 text-base-content/60">
        No cases to show yet.
      </div>
    );
  }

  return (
    <div className="card bg-base-100">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Case</th>
              <th>Instruction</th>
              <th>Service</th>
              <th>Deadline</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => {
              const badge = (CASE_BADGE as Record<string, string>)[c.status] ?? "neutral";
              return (
                <tr key={String(c._id)}>
                  <td>
                    <span className="font-mono text-sm">{c.caseId}</span>
                  </td>
                  <td>{c.instructingParty ?? "—"}</td>
                  <td className="text-sm">{c.serviceType ?? "—"}</td>
                  <td className="text-sm">{formatDate(c.deadline)}</td>
                  <td>
                    <span className={`badge badge-soft badge-${badge}`}>{c.status}</span>
                  </td>
                  <td>
                    <Link
                      href={`/portal/cases/${String(c._id)}`}
                      className="btn btn-ghost btn-xs"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}