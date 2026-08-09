import { getPortalPerson, getPsychologistProfile } from "@/services/portal";
import { PsychologistProfileForm } from "../profile-form";
import { ROLE_LABELS } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function PsychologistProfilePage() {
  const person = await getPortalPerson();
  const profile = await getPsychologistProfile(person.personId);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">My profile</h1>
      <p className="mt-1 text-base-content/70">
        Keep your details up to date so we can match the right cases.
      </p>

      {profile && (
        <div className="card card-body card-border mt-6 bg-base-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-base-content/70">{profile.email}</p>
            </div>
            <span className="badge badge-soft badge-primary">
              {ROLE_LABELS.PSYCHOLOGIST}
            </span>
          </div>
          <div className="divider" />
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-base-content/60">HCPC number</dt>
              <dd>{profile.hcpcNumber ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-base-content/60">Approval status</dt>
              <dd>{profile.status}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-base-content/60">Expertise</dt>
              <dd>
                {profile.expertise?.length
                  ? profile.expertise.map((e) => (
                      <span key={e} className="badge badge-soft badge-neutral mr-1">
                        {e}
                      </span>
                    ))
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="card card-body card-border mt-6 bg-base-100">
        <h2 className="text-lg font-semibold">Edit profile</h2>
        <PsychologistProfileForm />
      </div>
    </div>
  );
}