"use client";

import { useTransition, useState } from "react";
import { provisionAccount } from "@/services/provision-actions";

export function ProvisionButton({ qualifiedId }: { qualifiedId: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    type: "success" | "error";
    text: string;
    credentials?: { email: string; password: string };
  } | null>(null);

  function provision() {
    setResult(null);
    startTransition(async () => {
      const res = await provisionAccount(qualifiedId);
      if (res?.ok && res.credentials) {
        setResult({
          type: "success",
          text: res.message ?? "Account provisioned.",
          credentials: res.credentials,
        });
      } else {
        setResult({ type: "error", text: res?.message ?? "Failed." });
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {result?.type === "error" && (
        <span className="text-xs text-error">{result.text}</span>
      )}
      {result?.type === "success" && (
        <div className="alert alert-soft alert-success w-full text-left">
          <div>
            <p className="text-sm">{result.text}</p>
            {result.credentials && (
              <div className="mt-2 rounded-lg bg-base-200 p-3 font-mono text-xs">
                <div>Email: {result.credentials.email}</div>
                <div>Temporary password: {result.credentials.password}</div>
              </div>
            )}
          </div>
        </div>
      )}
      <button className="btn btn-outline btn-primary btn-sm" disabled={pending} onClick={provision}>
        {pending ? "Provisioning…" : "Provision account"}
      </button>
    </div>
  );
}