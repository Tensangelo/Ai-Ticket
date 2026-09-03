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
        className="inline-flex max-w-48 rounded-full bg-danger-bg px-2.5 py-0.5 text-xs font-medium text-danger"
        title={errorMessage ?? "AI classification failed"}
      >
        AI failed
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="inline-flex rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-muted">
        AI pending
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent-dim">
      AI ok
    </span>
  );
}
