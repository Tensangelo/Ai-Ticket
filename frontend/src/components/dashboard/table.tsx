import Link from "next/link";
import { ClassificationBadge } from "@/components/tickets/status/classificationBadge";
import { PriorityBadge } from "@/components/tickets/status/priorityBadge";
import { TicketStatusBadge } from "@/components/tickets/status/statusBadge";
import { formatTicketDate } from "@/lib/format-date";
import type { TicketListItem } from "@/lib/types/ticket";

export function TicketTable({ tickets }: { tickets: TicketListItem[] }) {
  if (tickets.length === 0) {
    return (
      <p className="panel border-dashed px-4 py-10 text-center text-sm text-muted">
        No tickets yet. Use New ticket to create the first one.
      </p>
    );
  }
  return (
    <div className="panel overflow-x-auto">
      <table className="min-w-3xl w-full text-left text-sm">
        <caption className="sr-only">Operational tickets</caption>
        <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
          <tr className="bg-[#00232e]">
            <th scope="col" className="px-4 py-3 font-medium">
              Ticket
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Category
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Priority
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Owner
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              AI
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Created
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="relative border-b border-line last:border-0 transition-colors hover:bg-background"
            >
              <td className="px-4 py-3 pl-5">
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="absolute inset-0 z-10 cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label={`Open ticket: ${ticket.title}`}
                />
                <span className="font-medium text-foreground">
                  {ticket.title}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {ticket.customerName}
                </span>
              </td>
              <td className="px-4 py-3">
                <TicketStatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3 text-foreground">
                {ticket.category.name}
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td className="px-4 py-3 text-muted">
                {ticket.owner?.fullName ?? "Unassigned"}
              </td>
              <td className="px-4 py-3">
                <ClassificationBadge
                  status={ticket.classificationStatus}
                  errorMessage={ticket.classificationError}
                />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">
                {formatTicketDate(ticket.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
