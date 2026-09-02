import { TicketTable } from "@/components/ticket-table";
import { fetchTicketList } from "@/lib/api/tickets";

export default async function Home() {
  const { tickets, errorMessage } = await fetchTicketList();
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Current operational workload. Failed AI reviews show as “AI failed”.
        </p>
      </div>
      {errorMessage ? (
        <p
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errorMessage}
        </p>
      ) : null}
      <TicketTable tickets={tickets} />
    </section>
  );
}
