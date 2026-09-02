"use client";

import { FormEvent, useSyncExternalStore, type ReactNode } from "react";
import {
  OPERATOR_ROLE,
  getHasOperatorIdentityServerSnapshot,
  getHasOperatorIdentitySnapshot,
  saveOperatorIdentity,
  subscribeToOperatorIdentity,
} from "@/lib/operator";

export function OperatorGate({ children }: { children: ReactNode }) {
  const hasIdentity = useSyncExternalStore(
    subscribeToOperatorIdentity,
    getHasOperatorIdentitySnapshot,
    getHasOperatorIdentityServerSnapshot,
  );
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <h1 className="text-lg font-semibold text-zinc-900">
            Who is using this workspace?
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            We only store your name in this browser. Your role is always{" "}
            <span className="font-medium text-zinc-800">{OPERATOR_ROLE}</span>
            — comments will be signed with it. No login or password.
          </p>
          <label className="mt-4 block text-sm font-medium text-zinc-800">
            First name
            <input
              name="firstName"
              required
              minLength={2}
              autoFocus
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="mt-3 block text-sm font-medium text-zinc-800">
            Last name
            <input
              name="lastName"
              required
              minLength={2}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            className="mt-5 min-h-11 w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }
  return children;
}
