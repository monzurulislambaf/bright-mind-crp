import type { Metadata } from "next";
import { NewInstructionForm } from "../new-instruction-form";

export const metadata: Metadata = { title: "New Instruction" };

export default function NewInstructionPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">New instruction</h1>
      <p className="mt-1 text-base-content/70">
        Start a new case by providing the core instruction details.
      </p>
      <div className="card card-body card-border mt-6 bg-base-100">
        <NewInstructionForm />
      </div>
    </div>
  );
}