import { TicketBreadcrumb, TicketDetailView } from "@/components/tickets/detailView";
import { fetchCategories, fetchPriorities } from "@/lib/api/catalogs";
import { fetchTicketById } from "@/lib/api/tickets";
import { fetchUsers } from "@/lib/api/users";

interface TicketDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TicketDetailPageProps) {
  const { id } = await params;
  const { ticket } = await fetchTicketById(id);
  return {
    title: ticket
      ? `${ticket.title} · AI Ticket Workspace`
      : "Ticket not found",
  };
}

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const { id } = await params;
  const [{ ticket, errorMessage }, users, categories, priorities] =
    await Promise.all([
      fetchTicketById(id),
      fetchUsers(),
      fetchCategories(),
      fetchPriorities(),
    ]);
  if (!ticket) {
    return (
      <section className="px-3 sm:px-5">
        <TicketBreadcrumb currentLabel="Ticket not found" />
        <p role="alert" className="alert-error mt-6">
          {errorMessage ?? "This ticket was not found."}
        </p>
      </section>
    );
  }
  return (
    <section className="px-3 sm:px-5">
      <TicketDetailView
        ticket={ticket}
        users={users}
        categories={categories}
        priorities={priorities}
      />
    </section>
  );
}
