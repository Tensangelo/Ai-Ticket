"use client";

import { type ReactNode, type SubmitEventHandler } from "react";
import { useHasOperatorIdentity } from "@/components/operator/hooks/useIdentity";
import { OPERATOR_ROLE, saveOperatorIdentity } from "@/lib/operator";

export function OperatorGate({ children }: { children: ReactNode }) {
  const hasIdentity = useHasOperatorIdentity();
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    if (firstName.length < 2 || lastName.length < 2) {
      return;
    }
    saveOperatorIdentity({ firstName, lastName });
  };

  if (!hasIdentity) {
    return (
      <div className="flex min-h-full items-center justify-center px-4 py-16">
        <form onSubmit={handleSubmit} className="form-panel w-full max-w-md">
          <h1 className="page-title text-xl">Who is using this workspace?</h1>
          <p className="mt-2 text-sm text-muted">
            We only store your name in this browser. Your role is always{" "}
            <span className="font-medium text-foreground">{OPERATOR_ROLE}</span>
            — comments will be signed with it. No login or password.
          </p>
          <label className="mt-4 block text-sm font-medium text-foreground">
            First name
            <input
              name="firstName"
              required
              minLength={2}
              autoFocus
              className="field"
            />
          </label>
          <label className="mt-3 block text-sm font-medium text-foreground">
            Last name
            <input name="lastName" required minLength={2} className="field" />
          </label>
          <div className="form-actions mt-5">
            <button type="submit" className="btn-primary">
              Continue
            </button>
          </div>
        </form>
      </div>
    );
  }
  return children;
}
