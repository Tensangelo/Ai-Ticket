import type { ClassificationStatus } from "@/lib/types/ticket";

interface ClassificationBadgeProps {
  status: ClassificationStatus;
  errorMessage: string | null;
}

export function ClassificationBadge({
  status,
  errorMessage,
}: ClassificationBadgeProps) {
  if (status === "FAILED") {
    return (
      <span
        className="inline-flex max-w-48 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
        title={errorMessage ?? "AI classification failed"}
      >
        AI failed
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">
        AI pending
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
      AI ok
    </span>
  );
}
