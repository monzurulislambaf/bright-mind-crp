"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AuditFilters({
  filters,
  actions,
}: {
  filters: { action: string; search: string };
  actions: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [action, setAction] = useState(filters.action);
  const [search, setSearch] = useState(filters.search);

  function apply() {
    const sp = new URLSearchParams(params.toString());
    if (action) sp.set("action", action);
    else sp.delete("action");
    if (search.trim()) sp.set("search", search.trim());
    else sp.delete("search");
    sp.delete("page");
    router.push(`/crm/audit?${sp.toString()}`);
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-box bg-base-200 p-4 sm:flex-row sm:items-end">
      <div className="grow">
        <label className="label pb-1 text-sm font-medium">Search</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="Search by actor, action, resource, ID…"
          className="input w-full bg-base-100"
        />
      </div>
      <div className="sm:w-72">
        <label className="label pb-1 text-sm font-medium">Action</label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="select w-full bg-base-100"
        >
          <option value="">All actions</option>
          {actions.map((a) => (
            <option key={a} value={a}>
              {a}
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
