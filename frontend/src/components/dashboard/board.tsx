import { TicketBoardCard } from "@/components/dashboard/boardCard";
import {
  TICKET_STATUS_LABELS,
  TICKET_STATUSES,
  groupTicketsByStatus,
} from "@/components/tickets/status/labels";
import type { TicketListItem } from "@/lib/types/ticket";

export function TicketBoard({ tickets }: { tickets: TicketListItem[] }) {
  const grouped = groupTicketsByStatus(tickets);
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {TICKET_STATUSES.map((status) => {
        const columnTickets = grouped[status];
        return (
          <section
            key={status}
            className="panel flex max-h-[70vh] min-h-56 flex-col p-3"
            aria-labelledby={`board-${status}`}
          >
            <h2
              id={`board-${status}`}
              className="flex items-baseline justify-between gap-2 text-sm font-semibold text-foreground"
            >
              <span>{TICKET_STATUS_LABELS[status]}</span>
              <span className="text-xs font-medium text-accent">
                {columnTickets.length}
              </span>
            </h2>
            {columnTickets.length === 0 ? (
              <p className="mt-3 text-xs text-muted">
                No tickets in this column.
              </p>
            ) : (
              <ul className="mt-3 space-y-2 overflow-y-auto">
                {columnTickets.map((ticket) => (
                  <TicketBoardCard key={ticket.id} ticket={ticket} />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
