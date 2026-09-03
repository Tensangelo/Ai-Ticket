import type { ReactNode } from "react";
import Link from "next/link";
import { BackIcon } from "@/assets/icons/back";
import { AddCommentForm } from "@/components/tickets/forms/addComment";
import { ManageTicketForm } from "@/components/tickets/forms/manageTicket";
import { ClassificationBadge } from "@/components/tickets/status/classificationBadge";
import { PriorityBadge } from "@/components/tickets/status/priorityBadge";
import { TicketStatusBadge } from "@/components/tickets/status/statusBadge";
import { formatTicketDate } from "@/lib/format-date";
import type { CatalogItem, TicketDetail } from "@/lib/types/ticket";
import type { WorkspaceUser } from "@/lib/types/user";

const DetailField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
};

export const TicketBreadcrumb = ({
  currentLabel,
}: {
  currentLabel: string;
}) => {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-muted/30">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        <li>
          <Link
            href="/"
            className="inline-flex text-sm min-h-11 items-center gap-1.5 rounded-md text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <BackIcon width="16" height="16" className="shrink-0" />
            Dashboard
          </Link>
        </li>
        <li aria-hidden="true" className="select-none text-muted">
          /
        </li>
        <li className="min-w-0 truncate text-sm font-medium text-foreground">
          {currentLabel}
        </li>
      </ol>
    </nav>
  );
};

export const TicketDetailView = ({
  ticket,
  users,
  categories,
  priorities,
}: {
  ticket: TicketDetail;
  users: WorkspaceUser[];
  categories: CatalogItem[];
  priorities: CatalogItem[];
}) => {
  return (
    <article className="space-y-6">
      <TicketBreadcrumb currentLabel={ticket.title} />
      <header className="space-y-2">
        <p className="text-base text-muted">{ticket.customerName}</p>
        <h1 className="page-title">{ticket.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <TicketStatusBadge status={ticket.status} />
          <ClassificationBadge
            status={ticket.classificationStatus}
            errorMessage={ticket.classificationError}
          />
        </div>
      </header>
      {ticket.classificationStatus === "FAILED" &&
      ticket.classificationError ? (
        <p role="alert" className="alert-error">
          AI could not classify this ticket: {ticket.classificationError}
        </p>
      ) : null}
      <dl className="panel grid gap-4 p-4 sm:grid-cols-2">
        <DetailField label="Category">{ticket.category.name}</DetailField>
        <DetailField label="Priority">
          <PriorityBadge priority={ticket.priority} />
        </DetailField>
        <DetailField label="Owner">
          {ticket.owner?.fullName ?? "Unassigned"}
        </DetailField>
        <DetailField label="Created">
          {formatTicketDate(ticket.createdAt)}
        </DetailField>
        <DetailField label="Updated">
          {formatTicketDate(ticket.updatedAt)}
        </DetailField>
        <DetailField label="Attachment">
          {ticket.attachmentUrl ? (
            <a
              href={ticket.attachmentUrl}
              className="break-all text-accent underline-offset-2 hover:underline"
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
      <section className="soft-panel">
        <h2 className="section-title text-muted">Request</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
          {ticket.description}
        </p>
      </section>
      <section className="soft-panel">
        <h2 className="section-title text-muted">AI summary</h2>
        <p className="mt-2 text-sm leading-6 text-foreground">
          {ticket.summary ?? "No summary yet."}
        </p>
      </section>
      <section className="soft-panel shadow-none rounded-lg border border-line">
        <h2 className="section-title text-muted">Comments</h2>
        {ticket.comments.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No comments yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {ticket.comments.map((comment) => (
              <li key={comment.id} className="comment-card">
                <p className="text-xs font-medium text-accent-dim">
                  {comment.authorName}
                  <span className="font-normal text-muted">
                    {" "}
                    · {comment.authorRole}
                  </span>
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {comment.content}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {formatTicketDate(comment.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <AddCommentForm ticketId={ticket.id} />
      <ManageTicketForm
        ticket={ticket}
        users={users}
        categories={categories}
        priorities={priorities}
      />
    </article>
  );
};
