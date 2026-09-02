import Link from "next/link";
import { ClassificationBadge } from "@/components/classification-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { TicketStatusBadge } from "@/components/ticket-status-badge";
import { formatTicketDate } from "@/lib/format-date";
import type { TicketListItem } from "@/lib/types/ticket";

export function TicketTable({ tickets }: { tickets: TicketListItem[] }) {
  if (tickets.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-white px-4 py-10 text-center text-sm text-zinc-600">
        No tickets yet. Use New ticket to create the first one.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">Operational tickets</caption>
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-600">
          <tr>
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
              className="relative border-b border-zinc-100 last:border-0 transition-colors hover:bg-zinc-50"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="absolute inset-0 z-10 cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                  aria-label={`Open ticket: ${ticket.title}`}
                />
                <span className="font-medium text-zinc-900">
                  {ticket.title}
                </span>
                <span className="mt-0.5 block text-xs text-zinc-500">
                  {ticket.customerName}
                </span>
              </td>
              <td className="px-4 py-3">
                <TicketStatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3 text-zinc-800">
                {ticket.category.name}
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td className="px-4 py-3 text-zinc-600">
                {ticket.owner?.fullName ?? "Unassigned"}
              </td>
              <td className="px-4 py-3">
                <ClassificationBadge
                  status={ticket.classificationStatus}
                  errorMessage={ticket.classificationError}
                />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                {formatTicketDate(ticket.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
