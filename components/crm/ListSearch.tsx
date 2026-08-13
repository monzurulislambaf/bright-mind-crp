"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export type ListSearchProps = {
  /** Base path the filter should push to (e.g. "/crm/tasks"). */
  path: string;
  /** Current search text (from server-side searchParams). */
  search?: string;
  /** Current status value (from server-side searchParams). */
  status?: string;
  /** Optional status options rendered as a select. */
  statuses?: readonly string[];
  placeholder?: string;
  label?: string;
};

/**
 * Search box for CRM list pages. Matches any column value on the server and
 * keeps `?search=` / `?status=` in sync with the URL.
 */
export function ListSearch({
  path,
  search = "",
  status = "",
  statuses,
  placeholder = "Search all columns…",
  label = "Search",
}: ListSearchProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [text, setText] = useState(search);
  const [sel, setSel] = useState(status);

  function apply() {
    const sp = new URLSearchParams();
    if (text.trim()) sp.set("search", text.trim());
    if (sel) sp.set("status", sel);
    if (params.get("page")) sp.delete("page");
    const qs = sp.toString();
    router.push(qs ? `${path}?${qs}` : path);
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-box bg-base-200 p-4 sm:flex-row sm:items-end">
      <div className="grow">
        <label className="label pb-1 text-sm font-medium">{label}</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder={placeholder}
          className="input w-full bg-base-100"
        />
      </div>
      {statuses && statuses.length > 0 && (
        <div className="sm:w-52">
          <label className="label pb-1 text-sm font-medium">Status</label>
          <select
            value={sel}
            onChange={(e) => setSel(e.target.value)}
            className="select w-full bg-base-100"
          >
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
      <button onClick={apply} className="btn btn-primary">
        Apply
      </button>
    </div>
  );
}
