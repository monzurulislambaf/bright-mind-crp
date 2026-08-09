"use client";

import { useTransition, useState } from "react";
import { convertQualifiedLead } from "@/services/crm-actions";

export function ConvertButton({ qualifiedId }: { qualifiedId: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function convert() {
    startTransition(async () => {
      const res = await convertQualifiedLead(qualifiedId);
      setMessage(res?.ok ? "Converted." : (res?.message ?? "Failed."));
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {message && <span className="text-xs text-base-content/60">{message}</span>}
      <button className="btn btn-primary btn-sm" disabled={pending} onClick={convert}>
        {pending ? "Converting…" : "Convert to record"}
      </button>
    </div>
  );
}