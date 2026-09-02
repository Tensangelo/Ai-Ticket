export const OPERATOR_ROLE = "Head of Operations";

export const OPERATOR_STORAGE_KEY = "ai-ticket-operator";

const OPERATOR_IDENTITY_EVENT = "operator-identity-changed";

export interface OperatorIdentity {
  firstName: string;
  lastName: string;
}

let cachedRawValue: string | null = null;
let cachedIdentity: OperatorIdentity | null = null;

function parseStoredIdentity(rawValue: string | null): OperatorIdentity | null {
  if (rawValue === cachedRawValue) {
    return cachedIdentity;
  }
  cachedRawValue = rawValue;
  if (!rawValue) {
    cachedIdentity = null;
    return null;
  }
  try {
    const parsed = JSON.parse(rawValue) as OperatorIdentity;
    if (!parsed.firstName || !parsed.lastName) {
      cachedIdentity = null;
      return null;
    }
    cachedIdentity = parsed;
    return parsed;
  } catch {
    cachedIdentity = null;
    return null;
  }
}

export function getOperatorFullName(identity: OperatorIdentity): string {
  return `${identity.firstName} ${identity.lastName}`.trim();
}

export function readOperatorIdentity(): OperatorIdentity | null {
  if (typeof window === "undefined") {
    return null;
  }
  return parseStoredIdentity(window.localStorage.getItem(OPERATOR_STORAGE_KEY));
}

export function subscribeToOperatorIdentity(
  onStoreChange: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }
  window.addEventListener(OPERATOR_IDENTITY_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(OPERATOR_IDENTITY_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function getOperatorIdentitySnapshot(): OperatorIdentity | null {
  return readOperatorIdentity();
}

export function getOperatorIdentityServerSnapshot(): OperatorIdentity | null {
  return null;
}

export function getHasOperatorIdentitySnapshot(): boolean {
  return readOperatorIdentity() !== null;
}

export function getHasOperatorIdentityServerSnapshot(): boolean {
  return false;
}

export function saveOperatorIdentity(identity: OperatorIdentity): void {
  window.localStorage.setItem(OPERATOR_STORAGE_KEY, JSON.stringify(identity));
  cachedRawValue = null;
  window.dispatchEvent(new Event(OPERATOR_IDENTITY_EVENT));
}
