import type { Metadata } from "next";
import { getPortalPerson, listAssignedCases } from "@/services/portal";
import { NewReportForm, type CaseOption } from "@/app/portal/psychologist/new-report-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "New Report" };

export default async function NewPortalReportPage() {
  const person = await getPortalPerson();
  const cases = await listAssignedCases(person);
  const options: CaseOption[] = cases.map((c) => ({
    _id: String(c._id),
    caseId: c.caseId,
    reportType: c.reportType ?? undefined,
  }));

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Draft a report</h1>
      <p className="mt-1 text-base-content/70">
        {options.length > 0
          ? "Choose one of your assigned cases to draft against."
          : "You have no assigned cases yet — once a case is assigned you can draft a report."}
      </p>
      <div className="card card-body card-border mt-6 bg-base-100">
        <NewReportForm cases={options} />
      </div>
    </div>
  );
}