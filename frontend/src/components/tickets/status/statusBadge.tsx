import { TICKET_STATUS_LABELS } from "@/components/tickets/status/labels";
import type { TicketStatus } from "@/lib/types/ticket";

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className="inline-flex rounded-full border border-line bg-background px-2.5 py-0.5 text-xs font-medium text-muted">
      {TICKET_STATUS_LABELS[status]}
    </span>
  );
}
