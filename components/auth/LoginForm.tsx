"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthState } from "@/lib/auth/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    login,
    undefined
  );

  return (
    <form action={action} className="space-y-4">
      {state?.message && (
        <div role="alert" className="alert alert-error alert-soft sm:alert-horizontal">
          <span>{state.message}</span>
        </div>
      )}

      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className="input input-lg w-full" placeholder="you@example.com" />
      </div>

      <div>
        <label className="label pb-1 text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input id="password" name="password" type="password" required className="input input-lg w-full" placeholder="••••••••" />
      </div>

      <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={pending}>
        {pending ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>

      <p className="text-center text-sm text-base-content/70">
        No account?{" "}
        <Link href="/register" className="link link-primary">
          Register as an individual
        </Link>
      </p>
    </form>
  );
}