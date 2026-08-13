"use client";

import { useActionState } from "react";
import { createUser, type UserActionState } from "@/services/user-actions";
import { ALL_ROLES, ROLE_LABELS } from "@/lib/auth/roles";

export function NewUserForm() {
  const [state, action, pending] = useActionState<UserActionState, FormData>(
    createUser,
    undefined
  );

  const err = (f: string) => state?.errors?.[f]?.join(", ");

  return (
    <form action={action} className="space-y-4">
      {state?.message && (
        <div
          role="alert"
          className={`alert alert-soft ${
            state.ok ? "alert-success" : "alert-error"
          }`}
        >
          <span>{state.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="firstName">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            className="input w-full"
            placeholder="Jane"
          />
          {err("firstName") && (
            <p className="mt-1 text-sm text-error">{err("firstName")}</p>
          )}
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="lastName">
            Last name
          </label>
          <input id="lastName" name="lastName" className="input w-full" placeholder="Doe" />
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input w-full"
            placeholder="user@example.com"
          />
          {err("email") && <p className="mt-1 text-sm text-error">{err("email")}</p>}
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className="input w-full" placeholder="+44…" />
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="role">
            Role
          </label>
          <select id="role" name="role" required className="select w-full">
            <option value="">Select a role</option>
            {ALL_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
          {err("role") && <p className="mt-1 text-sm text-error">{err("role")}</p>}
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="userType">
            User type
          </label>
          <select id="userType" name="userType" className="select w-full" defaultValue="CLIENT">
            <option value="EMPLOYEE">Employee</option>
            <option value="PARTNER">Partner</option>
            <option value="PSYCHOLOGIST">Psychologist</option>
            <option value="CLIENT">Client</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label pb-1 text-sm font-medium" htmlFor="password">
            Temporary password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input w-full"
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          {err("password") && (
            <p className="mt-1 text-sm text-error">{err("password")}</p>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Creating…" : "Create user"}
      </button>
    </form>
  );
}
