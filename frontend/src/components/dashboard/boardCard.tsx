import Link from "next/link";
import { ClassificationBadge } from "@/components/tickets/status/classificationBadge";
import { PriorityBadge } from "@/components/tickets/status/priorityBadge";
import { formatTicketDate } from "@/lib/format-date";
import type { TicketListItem } from "@/lib/types/ticket";

export function TicketBoardCard({ ticket }: { ticket: TicketListItem }) {
  return (
    <li>
      <Link
        href={`/tickets/${ticket.id}`}
        className="block rounded-md border border-line bg-background p-3 transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <p className="text-sm font-medium text-foreground">{ticket.title}</p>
        <p className="mt-1 text-xs text-muted">{ticket.customerName}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <PriorityBadge priority={ticket.priority} />
          <ClassificationBadge
            status={ticket.classificationStatus}
            errorMessage={ticket.classificationError}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          {ticket.owner?.fullName ?? "Unassigned"}
          <span className="mx-1" aria-hidden="true">
            ·
          </span>
          {formatTicketDate(ticket.createdAt)}
        </p>
      </Link>
    </li>
  );
}
