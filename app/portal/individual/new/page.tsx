import type { Metadata } from "next";
import { ServiceRequestForm } from "../service-request-form";

export const metadata: Metadata = { title: "New Service Request" };

export default function NewServiceRequestPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">New service request</h1>
      <p className="mt-1 text-base-content/70">
        Tell us what you need and we&apos;ll get back to you.
      </p>
      <div className="card card-body card-border mt-6 bg-base-100">
        <ServiceRequestForm />
      </div>
    </div>
  );
}