import type { Metadata } from "next";
import { NewCaseForm } from "../new-case-form";
import { listOrganisations, listSolicitorsForOrganisation, listIndividualClients } from "@/services/cases";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "New Case" };

export default async function NewCasePage() {
  const [organisations, solicitors, clients] = await Promise.all([
    listOrganisations(),
    listSolicitorsForOrganisation(),
    listIndividualClients(),
  ]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Create a case</h1>
      <p className="mt-1 text-base-content/70">
        Manually record a case in the CRM.
      </p>
      <div className="card card-body card-border mt-6 bg-base-100">
        <NewCaseForm
          organisations={organisations}
          solicitors={solicitors}
          clients={clients}
        />
      </div>
    </div>
  );
}