"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { updateTicket } from "@/lib/api/tickets";
import type { CatalogItem, TicketDetail, TicketStatus } from "@/lib/types/ticket";
import type { WorkspaceUser } from "@/lib/types/user";

const TICKET_STATUSES: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

const statusLabels: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

interface TicketEditFormProps {
  ticket: TicketDetail;
  users: WorkspaceUser[];
  categories: CatalogItem[];
  priorities: CatalogItem[];
}

export function TicketEditForm({
  ticket,
  users,
  categories,
  priorities,
}: TicketEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const summary = String(formData.get("summary") ?? "").trim();
    if (summary.length < 3) {
      setErrorMessage("Summary must be at least 3 characters.");
      setSuccessMessage(null);
      return;
    }
    const ownerId = String(formData.get("ownerId") ?? "");
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    const result = await updateTicket(ticket.id, {
      status: String(formData.get("status")) as TicketStatus,
      ownerId: ownerId || undefined,
      categoryId: Number(formData.get("categoryId")),
      priorityId: Number(formData.get("priorityId")),
      summary,
    });
    setIsSubmitting(false);
    if (result.errorMessage) {
      setErrorMessage(result.errorMessage);
      return;
    }
    setSuccessMessage("Ticket updated.");
    router.refresh();
  };
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-zinc-900">Manage ticket</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Correct AI fields or update status and owner. Title and request stay as
        submitted.
      </p>
      <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-zinc-800">
          Status
          <select
            name="status"
            defaultValue={ticket.status}
            disabled={isSubmitting}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            {TICKET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-zinc-800">
          Owner
          <select
            name="ownerId"
            defaultValue={ticket.owner?.id ?? ""}
            disabled={isSubmitting}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            {ticket.owner ? null : <option value="">Unassigned</option>}
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} · {user.role}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-zinc-800">
          Category
          <select
            name="categoryId"
            defaultValue={ticket.category.id}
            disabled={isSubmitting}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-zinc-800">
          Priority
          <select
            name="priorityId"
            defaultValue={ticket.priority.id}
            disabled={isSubmitting}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-zinc-800 sm:col-span-2">
          AI summary
          <textarea
            name="summary"
            defaultValue={ticket.summary ?? ""}
            minLength={3}
            rows={3}
            disabled={isSubmitting}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        {errorMessage ? (
          <p role="alert" className="text-sm text-red-700 sm:col-span-2">
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? (
          <p className="text-sm text-emerald-700 sm:col-span-2">{successMessage}</p>
        ) : null}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
