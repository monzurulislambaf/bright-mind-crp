"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register, type AuthState } from "@/lib/auth/actions";

export default function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    register,
    undefined
  );

  function errorFor(field: string) {
    return state?.errors?.[field]?.join(", ");
  }

  return (
    <form action={action} className="space-y-4">
      {state?.message && (
        <div role="alert" className="alert alert-error alert-soft sm:alert-horizontal">
          <span>{state.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="firstName">
            First name
          </label>
          <input id="firstName" name="firstName" required className="input input-lg w-full" placeholder="Jane" />
          {errorFor("firstName") && <p className="mt-1 text-sm text-error">{errorFor("firstName")}</p>}
        </div>
        <div>
          <label className="label pb-1 text-sm font-medium" htmlFor="lastName">
            Last name
          </label>
          <input id="lastName" name="lastName" required className="input input-lg w-full" placeholder="Doe" />
          {errorFor("lastName") && <p className="mt-1 text-sm text-error">{errorFor("lastName")}</p>}
        </div>
      </div>

      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className="input input-lg w-full" placeholder="you@example.com" />
        {errorFor("email") && <p className="mt-1 text-sm text-error">{errorFor("email")}</p>}
      </div>

      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input id="password" name="password" type="password" required minLength={8} className="input input-lg w-full" placeholder="At least 8 characters" />
        {errorFor("password") && <p className="mt-1 text-sm text-error">{errorFor("password")}</p>}
      </div>

      <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={pending}>
        {pending ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </button>

      <p className="text-center text-sm text-base-content/70">
        Already registered?{" "}
        <Link href="/login" className="link link-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}