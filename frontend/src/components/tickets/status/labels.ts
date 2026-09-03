import type { TicketListItem, TicketStatus } from "@/lib/types/ticket";

export const TICKET_STATUSES: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export function groupTicketsByStatus(
  tickets: TicketListItem[],
): Record<TicketStatus, TicketListItem[]> {
  const grouped: Record<TicketStatus, TicketListItem[]> = {
    OPEN: [],
    IN_PROGRESS: [],
    RESOLVED: [],
    CLOSED: [],
  };
  for (const ticket of tickets) {
    grouped[ticket.status].push(ticket);
  }
  return grouped;
}
