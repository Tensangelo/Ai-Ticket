import type { TicketStatus } from "@/lib/types/ticket";

const statusLabels: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
      {statusLabels[status]}
    </span>
  );
}
