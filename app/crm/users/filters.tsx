"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ALL_ROLES, ROLE_LABELS } from "@/lib/auth/roles";

// Kept local to avoid pulling mongoose models into the client bundle.
const USER_STATUS = [
  "active",
  "inactive",
  "suspended",
  "invited",
  "disabled",
] as const;

export type UserFilters = { search: string; role: string; status: string };

export function UserFilters({ filters }: { filters: UserFilters }) {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(filters.search);
  const [role, setRole] = useState(filters.role);
  const [status, setStatus] = useState(filters.status);

  function apply() {
    const sp = new URLSearchParams(params.toString());
    if (search) sp.set("search", search);
    else sp.delete("search");
    if (role) sp.set("role", role);
    else sp.delete("role");
    if (status) sp.set("status", status);
    else sp.delete("status");
    sp.delete("page");
    router.push(`/crm/users?${sp.toString()}`);
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-box bg-base-200 p-4 sm:flex-row sm:items-end">
      <div className="grow">
        <label className="label pb-1 text-sm font-medium">Search</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="Name, email, user ID…"
          className="input w-full bg-base-100"
        />
      </div>
      <div className="sm:w-52">
        <label className="label pb-1 text-sm font-medium">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="select w-full bg-base-100"
        >
          <option value="">All roles</option>
          {ALL_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:w-44">
        <label className="label pb-1 text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select w-full bg-base-100"
        >
          <option value="">All statuses</option>
          {USER_STATUS.map((s) => (
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
