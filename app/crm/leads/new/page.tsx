import type { Metadata } from "next";
import { NewLeadForm } from "@/components/crm/NewLeadForm";

export const metadata: Metadata = { title: "New Lead" };

export default function NewLeadPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Create a lead</h1>
      <p className="mt-1 text-base-content/70">Manually add a lead to the funnel.</p>
      <div className="card card-body card-border mt-6 bg-base-100">
        <NewLeadForm />
      </div>
    </div>
  );
}