import {
  TICKET_STATUS_LABELS,
  TICKET_STATUSES,
  groupTicketsByStatus,
} from "@/components/tickets/status/labels";
import type { TicketListItem } from "@/lib/types/ticket";

export function TicketStatusSummary({ tickets }: { tickets: TicketListItem[] }) {
  const grouped = groupTicketsByStatus(tickets);
  return (
    <ul className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {TICKET_STATUSES.map((status) => {
        const count = grouped[status].length;
        return (
          <li key={status} className="panel px-3 py-3 sm:px-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {TICKET_STATUS_LABELS[status]}
            </p>
            <p className="mt-1 text-2xl font-semibold text-accent">{count}</p>
          </li>
        );
      })}
    </ul>
  );
}
