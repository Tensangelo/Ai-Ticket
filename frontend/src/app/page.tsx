import { TicketDashboard } from "@/components/dashboard/dashboard";
import { fetchTicketList } from "@/lib/api/tickets";

export default async function Home() {
  const { tickets, errorMessage } = await fetchTicketList();
  return (
    <section className="px-3 sm:px-5">
      <div className="mb-6">
        <h1 className="page-title">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Workload by status. Failed AI reviews show as “AI failed”.
        </p>
      </div>
      {errorMessage ? (
        <p role="alert" className="alert-error mb-4">
          {errorMessage}
        </p>
      ) : null}
      <TicketDashboard tickets={tickets} />
    </section>
  );
}
