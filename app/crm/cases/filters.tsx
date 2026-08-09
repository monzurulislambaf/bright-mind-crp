"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CASE_STATUS } from "@/lib/cases/statuses";

export type CaseFiltersState = { status: string; search: string };

export function CaseFilters({ filters }: { filters: CaseFiltersState }) {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState(filters.status);
  const [search, setSearch] = useState(filters.search);

  function apply() {
    const sp = new URLSearchParams(params.toString());
    if (search) sp.set("search", search);
    else sp.delete("search");
    if (status) sp.set("status", status);
    else sp.delete("status");
    sp.delete("page");
    router.push(`/crm/cases?${sp.toString()}`);
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-box bg-base-200 p-4 sm:flex-row sm:items-end">
      <div className="grow">
        <label className="label pb-1 text-sm font-medium">Search</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="Case ID, party, service, report type…"
          className="input w-full bg-base-100"
        />
      </div>
      <div className="sm:w-64">
        <label className="label pb-1 text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select w-full bg-base-100"
        >
          <option value="">All statuses</option>
          {CASE_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <button onClick={apply} className="btn btn-primary">
        Apply
      </button>
    </div>
  );
}