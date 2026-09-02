function formatDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export function formatTicketDate(isoDate: string): string {
  return formatDateTime(isoDate);
}
