import { notFound } from "next/navigation";
import { getPsychologistForReview } from "@/services/psychologists";
import { ReviewForm } from "../review-form";
import { PSYCH_BADGE } from "@/lib/psychologist/statuses";

export const dynamic = "force-dynamic";

export default async function PsychologistReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getPsychologistForReview(id);
  if (!p) notFound();

  const badge = PSYCH_BADGE[p.status] ?? "neutral";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">
        {p.firstName} {p.lastName}
      </h1>
      <p className="mt-1 text-base-content/70">
        {p.psychologistId} · HCPC: {p.hcpcNumber ?? "—"}
      </p>

      <div className="card card-body card-border mt-6 bg-base-100">
        <h2 className="text-lg font-semibold">Compliance status</h2>
        <div className="mt-3 flex items-center gap-3">
          <span className={`badge badge-lg badge-soft badge-${badge}`}>{p.status}</span>
          {p.rejectedReason && (
            <span className="text-sm text-error">{p.rejectedReason}</span>
          )}
          {p.approvedAt && (
            <span className="text-sm text-success">
              Approved {new Date(p.approvedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="card card-body card-border mt-6 bg-base-100">
        <h2 className="text-lg font-semibold">Contact</h2>
        <dl className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-base-content/60">Email</dt>
            <dd>{p.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-base-content/60">Phone</dt>
            <dd>{p.phone ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="card card-body card-border mt-6 bg-base-100">
        <h2 className="text-lg font-semibold">Qualifications</h2>
        <p className="mt-2 text-sm whitespace-pre-wrap">{p.qualifications?.join("\n") ?? "—"}</p>
      </div>

      <div className="card card-body card-border mt-6 bg-base-100">
        <h2 className="text-lg font-semibold">Expertise & availability</h2>
        <dl className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-base-content/60">Expertise</dt>
            <dd>
              {(p.expertise ?? []).map((e) => (
                <span key={e} className="badge badge-soft badge-neutral mr-1">
                  {e}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-base-content/60">Jurisdictions</dt>
            <dd>
              {(p.jurisdictions ?? []).map((j) => (
                <span key={j} className="badge badge-soft badge-neutral mr-1">
                  {j}
                </span>
              ))}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-base-content/60">Availability</dt>
            <dd>{p.availability ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="card card-body card-border mt-6 bg-base-100">
        <h2 className="text-lg font-semibold">Insurance</h2>
        <p className="mt-2 text-sm">{p.insuranceDetails ?? "—"}</p>
      </div>

      <div className="card card-body card-border mt-6 bg-base-100">
        <h2 className="text-lg font-semibold">Review action</h2>
        <ReviewForm psychologistId={String(p._id)} currentStatus={p.status} />
      </div>
    </div>
  );
}