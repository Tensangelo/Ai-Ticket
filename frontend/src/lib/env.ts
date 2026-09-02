// Base del API Nest. Next no lee el .env de la raiz del repo.
// En el navegador: NEXT_PUBLIC_API_URL (localhost:3001).
// En el servidor de Next (Docker): API_URL (http://backend:3001).

export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return (
      process.env.API_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:3001"
    );
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
}
