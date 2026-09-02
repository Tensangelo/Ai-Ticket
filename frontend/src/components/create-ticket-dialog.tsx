"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useId, useState } from "react";
import { createTicket } from "@/lib/api/tickets";

const MIN_CUSTOMER_NAME = 2;
const MIN_TITLE = 3;
const MIN_DESCRIPTION = 10;

export function CreateTicketDialog() {
  const router = useRouter();
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleOpen = () => {
    setErrorMessage(null);
    setIsOpen(true);
  };
  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    setIsOpen(false);
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const customerName = String(formData.get("customerName") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const attachmentUrl = String(formData.get("attachmentUrl") ?? "").trim();
    if (customerName.length < MIN_CUSTOMER_NAME) {
      setErrorMessage("Customer name must be at least 2 characters.");
      return;
    }
    if (title.length < MIN_TITLE) {
      setErrorMessage("Title must be at least 3 characters.");
      return;
    }
    if (description.length < MIN_DESCRIPTION) {
      setErrorMessage("Description must be at least 10 characters.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const result = await createTicket({
      customerName,
      title,
      description,
      attachmentUrl: attachmentUrl || undefined,
    });
    setIsSubmitting(false);
    if (!result.ticket) {
      setErrorMessage(result.errorMessage ?? "Could not create the ticket.");
      return;
    }
    setIsOpen(false);
    router.push(`/tickets/${result.ticket.id}`);
    router.refresh();
  };
  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="min-h-11 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        New ticket
      </button>
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              handleClose();
            }
          }}
        >
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-zinc-900/40"
            onClick={handleClose}
            disabled={isSubmitting}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-5 shadow-lg"
          >
            <h2 id={titleId} className="text-lg font-semibold text-zinc-900">
              New ticket
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Category, priority and summary are filled by AI after you submit.
            </p>
            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-zinc-800">
                Customer
                <input
                  name="customerName"
                  required
                  minLength={MIN_CUSTOMER_NAME}
                  autoFocus
                  disabled={isSubmitting}
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-zinc-800">
                Title
                <input
                  name="title"
                  required
                  minLength={MIN_TITLE}
                  disabled={isSubmitting}
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-zinc-800">
                Description
                <textarea
                  name="description"
                  required
                  minLength={MIN_DESCRIPTION}
                  rows={5}
                  disabled={isSubmitting}
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-zinc-800">
                Attachment URL
                <span className="font-normal text-zinc-500"> (optional)</span>
                <input
                  name="attachmentUrl"
                  type="url"
                  disabled={isSubmitting}
                  placeholder="https://"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </label>
              {errorMessage ? (
                <p role="alert" className="text-sm text-red-700">
                  {errorMessage}
                </p>
              ) : null}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="min-h-11 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-11 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                >
                  {isSubmitting ? "Creating and classifying…" : "Create ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
