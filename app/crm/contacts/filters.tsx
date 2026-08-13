"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ContactFilters({ filters }: { filters: { search: string } }) {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(filters.search);

  function apply() {
    const sp = new URLSearchParams(params.toString());
    if (search) sp.set("search", search);
    else sp.delete("search");
    sp.delete("page");
    router.push(`/crm/contacts?${sp.toString()}`);
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-box bg-base-200 p-4 sm:flex-row sm:items-end">
      <div className="grow">
        <label className="label pb-1 text-sm font-medium">Search</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="Name, email, phone, contact ID…"
          className="input w-full bg-base-100"
        />
      </div>
      <button onClick={apply} className="btn btn-primary">
        Apply
      </button>
    </div>
  );
}
