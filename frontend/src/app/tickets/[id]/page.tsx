import Link from "next/link";
import { TicketDetailView } from "@/components/ticket-detail-view";
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
      <section>
        <BackToDashboard />
        <p role="alert" className="mt-6 text-sm text-red-800">
          {errorMessage ?? "This ticket was not found."}
        </p>
      </section>
    );
  }
  return (
    <section>
      <BackToDashboard />
      <div className="mt-6">
        <TicketDetailView
          ticket={ticket}
          users={users}
          categories={categories}
          priorities={priorities}
        />
      </div>
    </section>
  );
}

function BackToDashboard() {
  return (
    <Link
      href="/"
      className="text-sm font-medium text-zinc-700 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
    >
      Back to dashboard
    </Link>
  );
}
