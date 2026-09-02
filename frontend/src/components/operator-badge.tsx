"use client";

import { useSyncExternalStore } from "react";
import {
  OPERATOR_ROLE,
  getOperatorFullName,
  getOperatorIdentityServerSnapshot,
  getOperatorIdentitySnapshot,
  subscribeToOperatorIdentity,
} from "@/lib/operator";

export function OperatorBadge() {
  const identity = useSyncExternalStore(
    subscribeToOperatorIdentity,
    getOperatorIdentitySnapshot,
    getOperatorIdentityServerSnapshot,
  );
  if (!identity) {
    return null;
  }
  return (
    <p className="hidden text-right text-xs text-zinc-500 sm:block">
      <span className="font-medium text-zinc-800">
        {getOperatorFullName(identity)}
      </span>
      <span className="block">{OPERATOR_ROLE}</span>
    </p>
  );
}
