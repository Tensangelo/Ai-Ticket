"use client";

import { useOperatorIdentity } from "@/components/operator/hooks/useIdentity";
import { OPERATOR_ROLE, getOperatorFullName } from "@/lib/operator";

export function OperatorBadge() {
  const identity = useOperatorIdentity();
  if (!identity) {
    return null;
  }
  const fullName = getOperatorFullName(identity);
  const initials = `${identity.firstName.charAt(0)}${identity.lastName.charAt(0)}`.toUpperCase();
  return (
    <div className="flex min-h-11 items-center gap-2 rounded-md border border-line bg-background px-2 py-1.5 sm:px-2.5">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent"
      >
        {initials}
      </span>
      <p className="hidden min-w-0 text-left text-xs sm:block">
        <span className="block truncate font-medium text-foreground">
          {fullName}
        </span>
        <span className="block truncate text-muted">{OPERATOR_ROLE}</span>
      </p>
      <span className="sr-only sm:hidden">
        {fullName}, {OPERATOR_ROLE}
      </span>
    </div>
  );
}
