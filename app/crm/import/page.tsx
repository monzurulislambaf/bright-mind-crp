import type { Metadata } from "next";
import { ImportCsvForm } from "@/components/crm/ImportCsvForm";

export const metadata: Metadata = { title: "Import Leads" };

export default function ImportLeadsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Import leads</h1>
      <p className="mt-1 text-base-content/70">
        Paste CSV data, map columns, and import. Duplicates (by email) are
        detected automatically and skipped.
      </p>
      <div className="card card-body card-border mt-6 bg-base-100">
        <ImportCsvForm />
      </div>
    </div>
  );
}