"use client";

import { type SubmitEventHandler } from "react";
import { useUpdateTicket } from "@/components/tickets/hooks/useUpdate";
import {
  TICKET_STATUS_LABELS,
  TICKET_STATUSES,
} from "@/components/tickets/status/labels";
import type {
  CatalogItem,
  TicketDetail,
  TicketStatus,
} from "@/lib/types/ticket";
import type { WorkspaceUser } from "@/lib/types/user";

interface ManageTicketFormProps {
  ticket: TicketDetail;
  users: WorkspaceUser[];
  categories: CatalogItem[];
  priorities: CatalogItem[];
}

export function ManageTicketForm({
  ticket,
  users,
  categories,
  priorities,
}: ManageTicketFormProps) {
  const { isSubmitting, errorMessage, successMessage, submitUpdateTicket } =
    useUpdateTicket(ticket.id);
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const ownerId = String(formData.get("ownerId") ?? "");
    void submitUpdateTicket({
      status: String(formData.get("status")) as TicketStatus,
      ownerId: ownerId || null,
      categoryId: Number(formData.get("categoryId")),
      priorityId: Number(formData.get("priorityId")),
      summary: String(formData.get("summary") ?? ""),
    });
  };
  return (
    <section className="form-panel">
      <h2 className="section-title text-accent">Manage ticket</h2>
      <p className="mt-1 text-sm text-muted">
        Correct AI fields or update status and owner. Title and request stay as
        submitted.
      </p>
      <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-foreground">
          Status
          <select
            name="status"
            defaultValue={ticket.status}
            disabled={isSubmitting}
            className="field"
          >
            {TICKET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {TICKET_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-foreground">
          Owner
          <select
            name="ownerId"
            defaultValue={ticket.owner?.id ?? ""}
            disabled={isSubmitting}
            className="field"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} · {user.role}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-foreground">
          Category
          <select
            name="categoryId"
            defaultValue={ticket.category.id}
            disabled={isSubmitting}
            className="field"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-foreground">
          Priority
          <select
            name="priorityId"
            defaultValue={ticket.priority.id}
            disabled={isSubmitting}
            className="field"
          >
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-foreground sm:col-span-2">
          AI summary
          <textarea
            name="summary"
            defaultValue={ticket.summary ?? ""}
            minLength={3}
            rows={3}
            disabled={isSubmitting}
            className="field"
          />
        </label>
        {errorMessage ? (
          <p role="alert" className="text-sm text-danger sm:col-span-2">
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? (
          <p className="text-sm text-accent-dim sm:col-span-2">
            {successMessage}
          </p>
        ) : null}
        <div className="form-actions sm:col-span-2">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
