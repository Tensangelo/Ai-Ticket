import type { ReactNode } from "react";
import { AddCommentForm } from "@/components/add-comment-form";
import { ClassificationBadge } from "@/components/classification-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { TicketEditForm } from "@/components/ticket-edit-form";
import { TicketStatusBadge } from "@/components/ticket-status-badge";
import { formatTicketDate } from "@/lib/format-date";
import type { CatalogItem, TicketDetail } from "@/lib/types/ticket";
import type { WorkspaceUser } from "@/lib/types/user";

function DetailField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-zinc-900">{children}</dd>
    </div>
  );
}

export function TicketDetailView({
  ticket,
  users,
  categories,
  priorities,
}: {
  ticket: TicketDetail;
  users: WorkspaceUser[];
  categories: CatalogItem[];
  priorities: CatalogItem[];
}) {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm text-zinc-500">{ticket.customerName}</p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          {ticket.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <TicketStatusBadge status={ticket.status} />
          <ClassificationBadge
            status={ticket.classificationStatus}
            errorMessage={ticket.classificationError}
          />
        </div>
      </header>
      {ticket.classificationStatus === "FAILED" && ticket.classificationError ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          AI could not classify this ticket: {ticket.classificationError}
        </p>
      ) : null}
      <dl className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 sm:grid-cols-2">
        <DetailField label="Category">{ticket.category.name}</DetailField>
        <DetailField label="Priority">
          <PriorityBadge priority={ticket.priority} />
        </DetailField>
        <DetailField label="Owner">
          {ticket.owner?.fullName ?? "Unassigned"}
        </DetailField>
        <DetailField label="Created">{formatTicketDate(ticket.createdAt)}</DetailField>
        <DetailField label="Updated">{formatTicketDate(ticket.updatedAt)}</DetailField>
        <DetailField label="Attachment">
          {ticket.attachmentUrl ? (
            <a
              href={ticket.attachmentUrl}
              className="break-all text-zinc-900 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ticket.attachmentUrl}
            </a>
          ) : (
            "None"
          )}
        </DetailField>
      </dl>
      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-zinc-900">Request</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-800">
          {ticket.description}
        </p>
      </section>
      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-zinc-900">AI summary</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-800">
          {ticket.summary ?? "No summary yet."}
        </p>
      </section>
      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-zinc-900">Comments</h2>
        {ticket.comments.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600">No comments yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {ticket.comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-md border border-zinc-100 bg-zinc-50 px-3 py-2"
              >
                <p className="text-xs font-medium text-zinc-700">
                  {comment.authorName}
                  <span className="font-normal text-zinc-500">
                    {" "}
                    · {comment.authorRole}
                  </span>
                </p>
                <p className="mt-1 text-sm text-zinc-800">{comment.content}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {formatTicketDate(comment.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
        <AddCommentForm ticketId={ticket.id} />
      </section>
      <TicketEditForm
        ticket={ticket}
        users={users}
        categories={categories}
        priorities={priorities}
      />
    </article>
  );
}
