import Link from "next/link";
import type { Metadata } from "next";
import { NewUserForm } from "@/components/crm/NewUserForm";

export const metadata: Metadata = { title: "New User" };

export default function NewUserPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-4">
        <Link href="/crm/users" className="link link-hover text-sm">
          ← Back to users
        </Link>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Create a user</h1>
      <p className="mt-1 text-base-content/70">
        Provision an account for an employee, partner, psychologist or client.
        A system-generated user ID (BM-USR-…) is assigned automatically.
      </p>
      <div className="card card-body card-border mt-6 bg-base-100">
        <NewUserForm />
      </div>
    </div>
  );
}
