import type { Metadata } from "next";
import { queryCases } from "@/services/cases";
import { NewReportForm, type CaseOption } from "../new-report-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "New Report" };

export default async function NewReportPage() {
  const { cases } = await queryCases({ pageSize: 500 });
  const options: CaseOption[] = cases.map((c) => ({
    _id: String(c._id),
    caseId: c.caseId,
    reportType: c.reportType ?? undefined,
  }));

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Create a report</h1>
      <p className="mt-1 text-base-content/70">
        Start a report draft against a case.
      </p>
      <div className="card card-body card-border mt-6 bg-base-100">
        <NewReportForm cases={options} />
      </div>
    </div>
  );
}