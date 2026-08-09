"use client";

import { useTransition } from "react";
import { respondToOffer } from "@/services/portal-actions";

export default function OfferActions({ caseId }: { caseId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="btn btn-primary btn-sm"
        disabled={pending}
        onClick={() => startTransition(() => { void respondToOffer(caseId, "accept"); })}
      >
        {pending ? "Updating…" : "Accept"}
      </button>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        disabled={pending}
        onClick={() => startTransition(() => { void respondToOffer(caseId, "decline"); })}
      >
        {pending ? "Updating…" : "Decline"}
      </button>
    </div>
  );
}