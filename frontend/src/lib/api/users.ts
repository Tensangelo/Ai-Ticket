import { getApiBaseUrl } from "@/lib/env";
import type { WorkspaceUser } from "@/lib/types/user";

export async function fetchUsers(): Promise<WorkspaceUser[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/users`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    return (await response.json()) as WorkspaceUser[];
  } catch {
    return [];
  }
}
