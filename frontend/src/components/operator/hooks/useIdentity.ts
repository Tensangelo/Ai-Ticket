"use client";

import { useSyncExternalStore } from "react";
import {
  getHasOperatorIdentityServerSnapshot,
  getHasOperatorIdentitySnapshot,
  getOperatorIdentityServerSnapshot,
  getOperatorIdentitySnapshot,
  subscribeToOperatorIdentity,
} from "@/lib/operator";

export function useOperatorIdentity() {
  return useSyncExternalStore(
    subscribeToOperatorIdentity,
    getOperatorIdentitySnapshot,
    getOperatorIdentityServerSnapshot,
  );
}

export function useHasOperatorIdentity() {
  return useSyncExternalStore(
    subscribeToOperatorIdentity,
    getHasOperatorIdentitySnapshot,
    getHasOperatorIdentityServerSnapshot,
  );
}
