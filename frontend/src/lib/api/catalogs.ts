import { getApiBaseUrl } from "@/lib/env";
import type { CatalogItem } from "@/lib/types/ticket";

export async function fetchCategories(): Promise<CatalogItem[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/categories`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    return (await response.json()) as CatalogItem[];
  } catch {
    return [];
  }
}

export async function fetchPriorities(): Promise<CatalogItem[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/priorities`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    return (await response.json()) as CatalogItem[];
  } catch {
    return [];
  }
}
