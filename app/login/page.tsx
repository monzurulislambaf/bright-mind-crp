import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center bg-base-200 px-4 py-16">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="card w-full max-w-md bg-base-100 shadow-md">
        <div className="card-body">
          <h1 className="card-title text-2xl">Sign in to Bright Mind</h1>
          <p className="text-sm text-base-content/70">
            Access your secure portal.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}